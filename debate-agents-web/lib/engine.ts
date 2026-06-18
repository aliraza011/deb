import { DEFAULT_AGENTS } from "./agents";
import { agentPrompt, agreementPrompt, evolutionPrompt } from "./prompts";
import { callLLM } from "./llm";
import { Agreement, BeliefUpdate, DebateMessage, DebateResult } from "./types";

const ROUNDS = [
  "opening statement",
  "cross examination",
  "steelman an opponent",
  "rebuttal",
  "convergence and remaining disagreement"
];

function safeJson<T>(text: string, fallback: T): T {
  try {
    const cleaned = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

export async function runDebate(topic: string, selectedAgentIds?: string[]): Promise<DebateResult> {
  const agents = DEFAULT_AGENTS.filter((a) => !selectedAgentIds?.length || selectedAgentIds.includes(a.id));
  const messages: DebateMessage[] = [];

  for (const round of ROUNDS) {
    for (const agent of agents) {
      const content = await callLLM(agentPrompt(agent, topic, round, messages));
      messages.push({
        id: crypto.randomUUID(),
        round,
        agentId: agent.id,
        agentName: agent.name,
        content
      });
    }
  }

  const agreementText = await callLLM(agreementPrompt(topic, messages));
  const agreement = safeJson<Agreement>(agreementText, {
    type: "no_consensus",
    score: 0.2,
    consensusStatement: "The debate did not produce a reliable consensus.",
    agreements: [],
    disagreements: ["The agreement parser failed or the debate remained unresolved."],
    tweetDraft: "The agents debated intensely, but no honest consensus emerged yet. Sometimes disagreement is the more truthful result."
  });

  const beliefUpdates: BeliefUpdate[] = [];
  for (const agent of agents) {
    const updateText = await callLLM(evolutionPrompt(agent, topic, messages));
    const parsed = safeJson<Omit<BeliefUpdate, "agentId" | "agentName">>(updateText, {
      topic,
      oldPosition: "Unknown",
      newPosition: "No reliable update parsed.",
      oldConfidence: 0.5,
      newConfidence: 0.5,
      reasonForUpdate: "The belief update parser failed."
    });

    beliefUpdates.push({
      agentId: agent.id,
      agentName: agent.name,
      ...parsed
    });
  }

  return { topic, messages, agreement, beliefUpdates };
}

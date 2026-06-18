import { Agent, DebateMessage } from "./types";

export function agentPrompt(agent: Agent, topic: string, round: string, transcript: DebateMessage[]) {
  const previous = transcript
    .slice(-10)
    .map((m) => `${m.round} | ${m.agentName}: ${m.content}`)
    .join("\n\n");

  return `You are ${agent.name}, representing ${agent.tradition}.

Core beliefs:
${agent.coreBeliefs.map((b) => `- ${b}`).join("\n")}

Epistemology:
${agent.epistemology}

Debate style:
${agent.debateStyle}

Topic:
${topic}

Current debate round:
${round}

Recent transcript:
${previous || "No previous messages."}

Instructions:
- Speak as this philosophical/theological perspective, not as a generic assistant.
- Be rigorous but charitable.
- Do not caricature other views.
- Keep your answer between 90 and 150 words.
- In steelman rounds, fairly represent another agent's strongest argument.
- In convergence rounds, identify what you can honestly agree with.
- Avoid claiming to be the real historical person; you are an interpretive agent.
`;
}

export function agreementPrompt(topic: string, transcript: DebateMessage[]) {
  return `Analyze this debate transcript about: ${topic}

Transcript:
${transcript.map((m) => `${m.round} | ${m.agentName}: ${m.content}`).join("\n\n")}

Return JSON only with this exact shape:
{
  "type": "full_consensus | soft_consensus | overlapping_consensus | practical_consensus | no_consensus",
  "score": 0.0,
  "consensusStatement": "one precise statement",
  "agreements": ["..."],
  "disagreements": ["..."],
  "tweetDraft": "a thoughtful post under 280 characters"
}

Rules:
- Do not invent agreement.
- Use overlapping_consensus when agents agree on wording but for different reasons.
- Use practical_consensus when they agree on action but not metaphysics.
- If score is below 0.65, tweetDraft should explain disagreement rather than consensus.
`;
}

export function evolutionPrompt(agent: Agent, topic: string, transcript: DebateMessage[]) {
  return `You update the belief state for ${agent.name} after a debate.

Agent worldview:
${agent.coreBeliefs.map((b) => `- ${b}`).join("\n")}

Openness factor: ${agent.openness}

Topic:
${topic}

Transcript:
${transcript.map((m) => `${m.round} | ${m.agentName}: ${m.content}`).join("\n\n")}

Return JSON only:
{
  "topic": "${topic}",
  "oldPosition": "initial or inferred prior position",
  "newPosition": "updated position",
  "oldConfidence": 0.0,
  "newConfidence": 0.0,
  "reasonForUpdate": "brief reason"
}

Rules:
- Update gradually.
- Do not make the agent abandon its identity easily.
- Confidence must be between 0 and 1.
`;
}

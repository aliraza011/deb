import OpenAI from "openai";

const apiKey = process.env.XAI_API_KEY;
const model = process.env.XAI_MODEL || "grok-4.3";

const client = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: "https://api.x.ai/v1",
    })
  : null;

export async function callLLM(prompt: string): Promise<string> {
  if (!client) return mockLLM(prompt);

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "developer",
        content: "You are powering a multi-agent philosophy and theology debate simulator. Be precise, fair, and concise."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return response.output_text.trim();
}

function mockLLM(prompt: string): string {
  if (prompt.includes("Return JSON only with this exact shape")) {
    return JSON.stringify({
      type: "overlapping_consensus",
      score: 0.78,
      consensusStatement:
        "The agents agree that serious moral reflection requires humility about one's own perspective, even when they disagree about metaphysical foundations.",
      agreements: [
        "Unchecked ego distorts moral judgment.",
        "Human beings need practices that discipline desire and self-deception."
      ],
      disagreements: [
        "Whether morality ultimately depends on God.",
        "Whether values are discovered, revealed, constructed, or cultivated."
      ],
      tweetDraft:
        "Different traditions disagree about God, self, and value. But many converge here: unchecked ego distorts judgment, and wisdom starts with humility about what we think we know."
    });
  }

  if (prompt.includes("Return JSON only:")) {
    return JSON.stringify({
      topic: "mock topic",
      oldPosition: "The agent began from its inherited tradition.",
      newPosition: "The agent keeps its core view but grants limited insight to opponents.",
      oldConfidence: 0.78,
      newConfidence: 0.74,
      reasonForUpdate: "Opposing agents presented a partially persuasive challenge."
    });
  }

  const nameMatch = prompt.match(/You are (.*?), representing/);
  const agentName = nameMatch?.[1] || "Agent";
  const roundMatch = prompt.match(/Current debate round:\n(.+)/);
  const round = roundMatch?.[1] || "opening";

  return `${agentName}: In this ${round} round, I would approach the topic from my tradition's deepest commitments. I affirm that genuine debate requires both conviction and humility. My position remains distinct, but I can recognize that rival perspectives may expose blind spots in my own language, assumptions, or moral psychology. The key question is not only who is correct, but what each worldview can explain without reducing the others to caricature.`;
}

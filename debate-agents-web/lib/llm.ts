import OpenAI from "openai";

const apiKey = process.env.XAI_API_KEY;
const model = process.env.XAI_MODEL || "grok-4.3";

const client = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: "https://api.x.ai/v1",
    })
  : null;

function mockLLM(prompt: string) {
  return [
    "Mock response:",
    "No XAI_API_KEY was found.",
    "Add XAI_API_KEY in Vercel to enable real Grok debates.",
  ].join(" ");
}

export async function callLLM(prompt: string): Promise<string> {
  if (!client) {
    return mockLLM(prompt);
  }

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a rigorous philosophical debate agent. Return clear plain text unless JSON is explicitly requested.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 900,
    });

    const text = response.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("xAI returned an empty response.");
    }

    return text;
  } catch (error: any) {
    const message =
      error?.response?.data?.error?.message ||
      error?.error?.message ||
      error?.message ||
      "Unknown xAI API error.";

    throw new Error(`xAI API error: ${message}`);
  }
}

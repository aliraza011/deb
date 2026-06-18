import { NextRequest, NextResponse } from "next/server";
import { runDebate } from "../../../lib/engine";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = String(body.topic || "").trim();
    const selectedAgentIds = Array.isArray(body.selectedAgentIds) ? body.selectedAgentIds : undefined;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required." }, { status: 400 });
    }

    const result = await runDebate(topic, selectedAgentIds);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Debate failed. Check your API key, model, and server logs." },
      { status: 500 }
    );
  }
}

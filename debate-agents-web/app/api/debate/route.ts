import { NextRequest, NextResponse } from "next/server";
import { runDebate } from "../../lib/engine";
 
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.topic || typeof body.topic !== "string") {
      return NextResponse.json(
        { ok: false, error: "Topic is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.agentIds) || body.agentIds.length === 0) {
      return NextResponse.json(
        { ok: false, error: "At least one agent is required." },
        { status: 400 }
      );
    }

    const result = await runDebate({
      topic: body.topic,
      agentIds: body.agentIds,
    });

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error: any) {
    console.error("Debate API error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Unknown debate server error.",
      },
      { status: 500 }
    );
  }
}

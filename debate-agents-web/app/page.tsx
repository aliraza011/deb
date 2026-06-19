"use client";

import { useMemo, useState } from "react";
import { DEFAULT_AGENTS } from "../lib/agents";
import { DebateMessage, DebateResult } from "../lib/types";

export default function Home() {
  const [topic, setTopic] = useState("Can morality exist without God?");
  const [selected, setSelected] = useState<string[]>(DEFAULT_AGENTS.map((a) => a.id));
  const [result, setResult] = useState<DebateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const groupedMessages = useMemo(() => {
    const groups: Record<string, DebateMessage[]> = {};
    if (!result) return groups;
    for (const message of result.messages) {
      groups[message.round] ||= [];
      groups[message.round].push(message);
    }
    return groups;
  }, [result]);

  function toggleAgent(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function startDebate() {
  setLoading(true);
  setError("");
  setResult(null);

  try {
    const res = await fetch("/api/debate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        agentIds: selected
      })
    });

    const text = await res.text();

    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text || "Server returned a non-JSON response.");
    }

    if (!res.ok || data.ok === false) {
      throw new Error(data.error || "Debate failed.");
    }

    setResult(data.result || data);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Multi-agent philosophy and theology simulator</p>
          <h1>Dialectic Agents</h1>
          <p className="subtitle">
            Pick traditions, enter a topic, watch them debate, evolve their belief states,
            and draft a public post when they reach honest common ground.
          </p>
        </div>
        <div className="statusCard">
          <span>Consensus engine</span>
          <strong>{result ? `${Math.round(result.agreement.score * 100)}%` : "Idle"}</strong>
        </div>
      </section>

      <section className="panel controls">
        <label className="topicLabel">
          Debate topic
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: Is suffering necessary for wisdom?"
          />
        </label>

        <div>
          <h2>Agents</h2>
          <div className="agentGrid">
            {DEFAULT_AGENTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => toggleAgent(agent.id)}
                className={`agentCard ${selected.includes(agent.id) ? "selected" : ""}`}
                type="button"
              >
                <span className="dot" style={{ background: agent.color }} />
                <strong>{agent.name}</strong>
                <small>{agent.tradition}</small>
              </button>
            ))}
          </div>
        </div>

        <button
          className="startButton"
          onClick={startDebate}
          disabled={loading || selected.length < 2 || !topic.trim()}
        >
          {loading ? "Debating..." : "Start debate"}
        </button>
        {error && <p className="error">{error}</p>}
      </section>

      {loading && (
        <section className="panel loadingPanel">
          <div className="spinner" />
          <p>The agents are debating through opening, challenge, steelman, rebuttal, and convergence rounds.</p>
        </section>
      )}

      {result && (
        <>
          <section className="panel agreement">
            <div>
              <p className="eyebrow">Agreement result</p>
              <h2>{result.agreement.type.replaceAll("_", " ")}</h2>
              <p>{result.agreement.consensusStatement}</p>
            </div>
            <div className="meter">
              <div style={{ width: `${result.agreement.score * 100}%` }} />
            </div>

            <div className="columns">
              <div>
                <h3>Agreements</h3>
                <ul>{result.agreement.agreements.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
              <div>
                <h3>Disagreements</h3>
                <ul>{result.agreement.disagreements.map((d) => <li key={d}>{d}</li>)}</ul>
              </div>
            </div>

            <div className="tweetBox">
              <h3>Draft post</h3>
              <p>{result.agreement.tweetDraft}</p>
              <button onClick={() => navigator.clipboard.writeText(result.agreement.tweetDraft)}>
                Copy post
              </button>
            </div>
          </section>

          <section className="panel">
            <h2>Debate transcript</h2>
            {Object.entries(groupedMessages).map(([round, messages]) => (
              <div className="round" key={round}>
                <h3>{round}</h3>
                <div className="messageGrid">
                  {messages.map((message) => {
                    const agent = DEFAULT_AGENTS.find((a) => a.id === message.agentId);
                    return (
                      <article className="message" key={message.id}>
                        <div className="messageHeader">
                          <span className="dot" style={{ background: agent?.color || "#999" }} />
                          <strong>{message.agentName}</strong>
                        </div>
                        <p>{message.content}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          <section className="panel">
            <h2>Belief evolution</h2>
            <div className="evolutionGrid">
              {result.beliefUpdates.map((update) => (
                <article className="evolution" key={update.agentId}>
                  <h3>{update.agentName}</h3>
                  <p><strong>Before:</strong> {update.oldPosition}</p>
                  <p><strong>After:</strong> {update.newPosition}</p>
                  <div className="confidence">
                    <span>{Math.round(update.oldConfidence * 100)}%</span>
                    <span>→</span>
                    <span>{Math.round(update.newConfidence * 100)}%</span>
                  </div>
                  <p>{update.reasonForUpdate}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

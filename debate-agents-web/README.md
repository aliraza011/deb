# Dialectic Agents

A Next.js starter website for multi-agent philosophy and theology debates.

## Features

- Choose philosopher/theology/ism agents
- Enter a debate topic
- Run five debate rounds
- Detect consensus or disagreement
- Generate a Twitter/X-style post draft
- Show belief evolution after the debate
- Works in mock mode without an API key

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your API key in `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.2
```

Then open:

```bash
http://localhost:3000
```

## Important note

The agents are interpretive simulations, not exact historical people. Keep a human review step before posting anything publicly.

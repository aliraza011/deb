export type Belief = {
  claim: string;
  position: string;
  confidence: number;
  reasons: string[];
};

export type Agent = {
  id: string;
  name: string;
  tradition: string;
  color: string;
  coreBeliefs: string[];
  epistemology: string;
  debateStyle: string;
  openness: number;
  beliefs: Belief[];
};

export type DebateMessage = {
  id: string;
  round: string;
  agentId: string;
  agentName: string;
  content: string;
};

export type BeliefUpdate = {
  agentId: string;
  agentName: string;
  topic: string;
  oldPosition: string;
  newPosition: string;
  oldConfidence: number;
  newConfidence: number;
  reasonForUpdate: string;
};

export type Agreement = {
  type: "full_consensus" | "soft_consensus" | "overlapping_consensus" | "practical_consensus" | "no_consensus";
  score: number;
  consensusStatement: string;
  agreements: string[];
  disagreements: string[];
  tweetDraft: string;
};

export type DebateResult = {
  topic: string;
  messages: DebateMessage[];
  agreement: Agreement;
  beliefUpdates: BeliefUpdate[];
};

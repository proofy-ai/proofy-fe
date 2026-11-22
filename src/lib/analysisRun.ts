export const POLL_INTERVAL_MS = 1500;
export const STEP_REVEAL_INTERVAL_MS = 450;
const POLL_TIMEOUT_MS = 180_000;

export const isRunTimedOut = (startedAt: string, now: number) =>
  now - Date.parse(startedAt) > POLL_TIMEOUT_MS;

export const DRAFT_HAS_EDITS_CODE = "DRAFT_HAS_EDITS";

export type AfterAnalysis = "chat" | "result";

export const getAfterAnalysisFromState = (state: unknown): AfterAnalysis =>
  typeof state === "object" &&
  state !== null &&
  "afterAnalysis" in state &&
  state.afterAnalysis === "result"
    ? "result"
    : "chat";

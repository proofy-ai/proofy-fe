export const POLL_INTERVAL_MS = 1500;
export const STEP_REVEAL_INTERVAL_MS = 450;
const POLL_TIMEOUT_MS = 180_000;

export const isRunTimedOut = (startedAt: string, now: number) =>
  now - Date.parse(startedAt) > POLL_TIMEOUT_MS;

export const DRAFT_HAS_EDITS_CODE = "DRAFT_HAS_EDITS";

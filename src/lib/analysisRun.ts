export const POLL_INTERVAL_MS = 1500;
export const RESULT_REVEAL_DELAY_MS = 1000;
const POLL_TIMEOUT_MS = 180_000;

export const isRunTimedOut = (startedAt: string, now: number) =>
  now - Date.parse(startedAt) > POLL_TIMEOUT_MS;

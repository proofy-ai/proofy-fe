export const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 180_000;

export const isRunTimedOut = (startedAt: string, now: number) =>
  now - Date.parse(startedAt) > POLL_TIMEOUT_MS;

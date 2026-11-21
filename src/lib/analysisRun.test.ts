import { describe, expect, it } from "vitest";

import { isRunTimedOut } from "@/lib/analysisRun";

const STARTED_AT = "2026-11-22T00:00:00.000Z";
const startedAtMs = Date.parse(STARTED_AT);

describe("isRunTimedOut", () => {
  it("시작 후 180초가 지나기 전에는 시간 초과가 아니다", () => {
    expect(isRunTimedOut(STARTED_AT, startedAtMs + 180_000)).toBe(false);
  });

  it("시작 후 180초가 지나면 시간 초과다", () => {
    expect(isRunTimedOut(STARTED_AT, startedAtMs + 180_001)).toBe(true);
  });
});

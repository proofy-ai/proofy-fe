import { describe, expect, it } from "vitest";

import { getAfterAnalysisFromState, isRunTimedOut } from "@/lib/analysisRun";

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

describe("getAfterAnalysisFromState", () => {
  it("처음 분석이 끝나면 프루피와의 대화로 간다", () => {
    expect(getAfterAnalysisFromState(null)).toBe("chat");
    expect(getAfterAnalysisFromState({})).toBe("chat");
  });

  it("답을 반영한 재분석이 끝나면 결과로 간다", () => {
    expect(getAfterAnalysisFromState({ afterAnalysis: "result" })).toBe(
      "result",
    );
  });
});

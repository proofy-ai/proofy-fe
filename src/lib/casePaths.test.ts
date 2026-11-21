import { describe, expect, it } from "vitest";

import { getContinuePath } from "@/lib/casePaths";

const baseCase = { caseId: "c1", hasResult: false, latestRun: null };

describe("getContinuePath", () => {
  it("분석 결과도 실행도 없으면 사연·증빙 화면으로 보낸다", () => {
    expect(getContinuePath(baseCase)).toBe("/cases/c1/evidence");
  });

  it("분석이 진행 중이면 분석 중 화면으로 보낸다", () => {
    const runningCase = {
      ...baseCase,
      latestRun: { runId: "r1", status: "RUNNING", stage: "COMPARING" },
    } as const;

    expect(getContinuePath(runningCase)).toBe("/cases/c1/analysis");
  });

  it("결과가 있으면 결과 화면으로 보낸다", () => {
    expect(getContinuePath({ ...baseCase, hasResult: true })).toBe(
      "/cases/c1/result",
    );
  });

  it("진행 중인 분석이 결과보다 우선한다", () => {
    const runningCase = {
      ...baseCase,
      hasResult: true,
      latestRun: { runId: "r2", status: "RUNNING", stage: "EXTRACTING" },
    } as const;

    expect(getContinuePath(runningCase)).toBe("/cases/c1/analysis");
  });
});

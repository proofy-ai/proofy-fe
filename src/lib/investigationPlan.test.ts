import { describe, expect, it } from "vitest";

import { expandPlanSteps } from "@/lib/investigationPlan";
import type { AnalysisStep } from "@/types/api";

const buildStep = (
  seq: number,
  title: string,
  summary: string,
): AnalysisStep => ({
  seq,
  type: "TOOL_CALL",
  title,
  summary,
  status: "DONE",
  at: "2026-11-23T00:00:00Z",
});

describe("expandPlanSteps", () => {
  it("조사 계획을 이유 줄과 항목별 단계로 나누고 번호를 다시 매긴다", () => {
    const steps = [
      buildStep(
        1,
        "조사 계획",
        "금액을 다시 확인합니다. → 확인할 것 2가지: 11/8 15만 원 입금(거래내역) · 법령 근거(법령)",
      ),
      buildStep(2, "계획 점검", "계획한 확인 2개를 모두 마쳤습니다."),
    ];

    const result = expandPlanSteps(steps);

    expect(
      result.map(({ seq, title, summary }) => [seq, title, summary]),
    ).toEqual([
      [1, "조사 계획", "금액을 다시 확인합니다."],
      [2, "11/8 15만 원 입금", "거래내역에서 조사할 계획이에요"],
      [3, "법령 근거", "관련 법령에서 근거를 찾을 계획이에요"],
      [4, "계획 점검", "계획한 확인 2개를 모두 마쳤습니다."],
    ]);
  });

  it("계획에서 나온 단계만 계획 표시를 단다", () => {
    const steps = [
      buildStep(1, "조사 계획", "확인할 것 1가지: 개인사업자(서류)"),
      buildStep(2, "계획 점검", "계획한 확인 1개를 모두 마쳤습니다."),
    ];

    const result = expandPlanSteps(steps);

    expect(result.map(({ isPlan }) => isPlan)).toEqual([true, true, false]);
  });

  it("항목 형식이 아니면 계획 단계를 그대로 둔다", () => {
    const steps = [buildStep(1, "조사 계획", "자료를 살펴봅니다.")];

    expect(expandPlanSteps(steps)).toEqual([{ ...steps[0], isPlan: true }]);
  });

  it("계획이 아닌 단계는 건드리지 않는다", () => {
    const steps = [buildStep(1, "거래내역 조회", "2건")];

    expect(expandPlanSteps(steps)).toEqual([{ ...steps[0], isPlan: false }]);
  });
});

import { describe, expect, it } from "vitest";

import { getDemoAnswer } from "@/lib/demoAnswers";

describe("getDemoAnswer", () => {
  it("체험 계정은 질문 순서대로 예시 답을 돌려준다", () => {
    expect(getDemoAnswer("GOODS", 0)).not.toBe("");
    expect(getDemoAnswer("GOODS", 0)).not.toBe(getDemoAnswer("UNEXPECTED", 0));
  });

  it("예시 답이 없거나 체험 계정이 아니면 빈 문자열을 돌려준다", () => {
    expect(getDemoAnswer("GOODS", 9)).toBe("");
    expect(getDemoAnswer(null, 0)).toBe("");
  });
});

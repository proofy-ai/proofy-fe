import { describe, expect, it } from "vitest";

import { buildAnswerInputs } from "@/lib/chatAnswers";

describe("buildAnswerInputs", () => {
  it("넘긴 질문과 빈 답은 빼고 앞뒤 공백을 없애 보낸다", () => {
    expect(
      buildAnswerInputs([
        { questionId: "q1", answer: "  추가 주문이 있었어요  " },
        { questionId: "q2", answer: null },
        { questionId: "q3", answer: "   " },
      ]),
    ).toEqual([{ questionId: "q1", answer: "추가 주문이 있었어요" }]);
  });
});

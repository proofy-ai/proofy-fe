import { describe, expect, it } from "vitest";

import { getAdviceQuestions } from "@/lib/draftAdvice";
import type { AgentQuestion, DraftSentence } from "@/types/api";

const createSentence = (findingIds: string[]) =>
  ({ findingIds }) as DraftSentence;

const questions = [
  { findingIds: ["f2"], text: "금액이 다른 이유가 있나요?" },
  { findingIds: ["f9"], text: "다른 문장의 질문" },
] as AgentQuestion[];

describe("getAdviceQuestions", () => {
  it("문장의 근거와 이어진 질문만 조언으로 보여 준다", () => {
    expect(getAdviceQuestions(createSentence(["f1", "f2"]), questions)).toEqual(
      ["금액이 다른 이유가 있나요?"],
    );
  });

  it("이어진 질문이 없으면 빈 목록을 돌려준다", () => {
    expect(getAdviceQuestions(createSentence([]), questions)).toEqual([]);
  });
});

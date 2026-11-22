import { describe, expect, it } from "vitest";

import { buildChatItems, getTypingDelay } from "@/lib/chatItems";
import type { AgentQuestion } from "@/types/api";

const questions = [
  { questionId: "q1", text: "첫째 질문" },
  { questionId: "q2", text: "둘째 질문" },
] as AgentQuestion[];

describe("buildChatItems", () => {
  it("처음에는 인사와 첫 질문만 보여 준다", () => {
    expect(
      buildChatItems(questions, [], false).map((item) => item.key),
    ).toEqual(["intro", "q-q1"]);
  });

  it("답하면 내 말풍선 뒤에 다음 질문이 이어진다", () => {
    const items = buildChatItems(
      questions,
      [{ questionId: "q1", answer: "답이에요" }],
      true,
    );

    expect(items.map((item) => item.key)).toEqual([
      "intro",
      "q-q1",
      "a-q1",
      "q-q2",
    ]);
  });

  it("모든 질문을 마치면 마무리 말을 붙인다", () => {
    const items = buildChatItems(
      questions,
      [
        { questionId: "q1", answer: "답" },
        { questionId: "q2", answer: null },
      ],
      true,
    );

    expect(items.at(-1)?.key).toBe("closing");
  });
});

describe("getTypingDelay", () => {
  it("내 말은 바로 보이고 프루피는 글자 수에 따라 잠깐 기다린다", () => {
    expect(getTypingDelay({ key: "a", kind: "user", answer: "답" })).toBe(0);
    expect(
      getTypingDelay({ key: "p", kind: "pruppy", text: "짧은 말" }),
    ).toBeLessThan(
      getTypingDelay({
        key: "p",
        kind: "pruppy",
        text: "아주 긴 말".repeat(30),
      }),
    );
  });
});

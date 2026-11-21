import { describe, expect, it } from "vitest";

import {
  getSectionTitle,
  toSentenceUpdates,
  withAppendedSentence,
  withConfirmed,
  withEditedText,
  withoutSentence,
} from "@/lib/draftEditing";
import type { DraftSentence } from "@/types/api";

const sentenceOf = (overrides: Partial<DraftSentence>): DraftSentence => ({
  sentenceId: "s1",
  text: "문장",
  origin: "AI",
  section: null,
  findingIds: [],
  needsCheck: false,
  needsCheckReason: null,
  confirmed: false,
  edited: false,
  ...overrides,
});

describe("toSentenceUpdates", () => {
  it("저장 요청에 필요한 값만 순서대로 담는다", () => {
    const updates = toSentenceUpdates([
      sentenceOf({ sentenceId: "s1", text: "가", confirmed: true }),
      sentenceOf({ sentenceId: "s2", text: "나" }),
    ]);

    expect(updates).toEqual([
      { sentenceId: "s1", text: "가", confirmed: true },
      { sentenceId: "s2", text: "나", confirmed: false },
    ]);
  });
});

describe("문장 변경", () => {
  const updates = [
    { sentenceId: "s1", text: "가", confirmed: false },
    { sentenceId: "s2", text: "나", confirmed: false },
  ];

  it("해당 문장의 글만 바꾼다", () => {
    expect(withEditedText(updates, "s2", "다")).toEqual([
      updates[0],
      { sentenceId: "s2", text: "다", confirmed: false },
    ]);
  });

  it("해당 문장의 확인 여부만 바꾼다", () => {
    expect(withConfirmed(updates, "s1", true)[0].confirmed).toBe(true);
    expect(withConfirmed(updates, "s1", true)[1].confirmed).toBe(false);
  });

  it("문장을 빼면 나머지 순서는 그대로다", () => {
    expect(withoutSentence(updates, "s1")).toEqual([updates[1]]);
  });

  it("새 문장은 sentenceId 없이 맨 뒤에 붙는다", () => {
    expect(withAppendedSentence(updates, "새 문장")[2]).toEqual({
      sentenceId: null,
      text: "새 문장",
    });
  });
});

describe("getSectionTitle", () => {
  const sentences = [
    sentenceOf({ sentenceId: "s1", section: "DEPOSIT_REASON" }),
    sentenceOf({ sentenceId: "s2", section: "DEPOSIT_REASON" }),
    sentenceOf({ sentenceId: "s3", section: "NO_INVOLVEMENT" }),
    sentenceOf({ sentenceId: "s4", section: null }),
  ];

  it("첫 문장과 묶음이 바뀌는 문장에 제목이 붙는다", () => {
    expect(getSectionTitle(sentences, 0)).toBe("입금 경위");
    expect(getSectionTitle(sentences, 2)).toBe("사기와 무관하다는 사실");
  });

  it("같은 묶음이 이어지거나 묶음이 없으면 제목이 없다", () => {
    expect(getSectionTitle(sentences, 1)).toBeNull();
    expect(getSectionTitle(sentences, 3)).toBeNull();
  });
});

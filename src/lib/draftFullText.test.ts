import { describe, expect, it } from "vitest";

import {
  groupSentencesIntoParagraphs,
  isHighlightedSentence,
} from "@/lib/draftFullText";
import type { DraftSentence } from "@/types/api";

const buildSentence = (
  sentenceId: string,
  overrides: Partial<DraftSentence> = {},
): DraftSentence => ({
  sentenceId,
  text: `문장 ${sentenceId}`,
  origin: "AI",
  section: null,
  findingIds: [],
  needsCheck: false,
  needsCheckReason: null,
  confirmed: false,
  edited: false,
  ...overrides,
});

describe("groupSentencesIntoParagraphs", () => {
  it("같은 구역의 문장은 한 문단으로 묶고 구역 제목을 단다", () => {
    const sentences = [
      buildSentence("a", { section: "DEPOSIT_REASON" }),
      buildSentence("b", { section: "DEPOSIT_REASON" }),
      buildSentence("c", { section: "NO_INVOLVEMENT" }),
    ];

    const paragraphs = groupSentencesIntoParagraphs(sentences);

    expect(
      paragraphs.map(({ title, sentences: group }) => [
        title,
        group.map((sentence) => sentence.sentenceId),
      ]),
    ).toEqual([
      ["입금 경위", ["a", "b"]],
      ["사기와 무관하다는 사실", ["c"]],
    ]);
  });

  it("구역이 없는 문장은 제목 없는 문단으로 묶는다", () => {
    const paragraphs = groupSentencesIntoParagraphs([
      buildSentence("a"),
      buildSentence("b"),
    ]);

    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].title).toBeNull();
  });
});

describe("isHighlightedSentence", () => {
  it("확인이 필요하고 아직 확인하지 않은 문장만 강조한다", () => {
    expect(
      isHighlightedSentence(buildSentence("a", { needsCheck: true })),
    ).toBe(true);
    expect(
      isHighlightedSentence(
        buildSentence("a", { needsCheck: true, confirmed: true }),
      ),
    ).toBe(false);
    expect(isHighlightedSentence(buildSentence("a"))).toBe(false);
  });
});

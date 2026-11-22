import type { DraftSection, NeedsCheckReason } from "@/types/api";

export const NEEDS_CHECK_ADVICE = {
  CONFLICT: "자료와 어긋난 내용이에요. 수정할 부분이 있는지 확인해 보세요.",
  NO_SOURCE: "근거가 되는 자료가 없어요. 관련 자료가 있다면 더 올려 보세요.",
  QUOTE_NOT_FOUND: "원문에서 찾지 못한 내용이에요. 직접 확인해 보세요.",
  NUMBER_MISMATCH: "숫자가 자료와 달라요. 금액과 날짜를 다시 확인해 보세요.",
  JUDGMENT_EXPRESSION:
    "판단처럼 읽히는 표현이에요. 사실만 담도록 다듬어 보세요.",
  SOURCE_UNREAD: "근거 서류를 읽지 못했어요. 내용을 직접 확인해 보세요.",
} satisfies Record<NeedsCheckReason, string>;

export const DRAFT_SECTION_TITLES = {
  DEPOSIT_REASON: "입금 경위",
  NO_INVOLVEMENT: "사기와 무관하다는 사실",
  VICTIM_CONTEXT: "피해 상황",
} satisfies Record<DraftSection, string>;

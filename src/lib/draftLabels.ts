import type { DraftSection, NeedsCheckReason } from "@/types/api";

export const NEEDS_CHECK_REASON_LABELS = {
  CONFLICT: "자료와 어긋난 내용이에요",
  NO_SOURCE: "근거가 되는 자료가 없어요",
  QUOTE_NOT_FOUND: "인용한 내용을 원문에서 찾지 못했어요",
  NUMBER_MISMATCH: "숫자가 근거와 달라요",
  JUDGMENT_EXPRESSION: "판단처럼 읽히는 표현이에요",
  SOURCE_UNREAD: "근거 서류를 읽지 못했어요",
} satisfies Record<NeedsCheckReason, string>;

export const DRAFT_SECTION_TITLES = {
  DEPOSIT_REASON: "입금 경위",
  NO_INVOLVEMENT: "사기와 무관하다는 사실",
  VICTIM_CONTEXT: "피해 상황",
} satisfies Record<DraftSection, string>;

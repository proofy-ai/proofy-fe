import type { ConflictField, FindingStatus } from "@/types/api";

export const FINDING_STATUS_LABELS = {
  MATCH: "자료와 일치",
  CONFLICT: "자료와 어긋남",
  STATEMENT_ONLY: "진술만 있음",
  UNKNOWN: "확인 불가",
} satisfies Record<FindingStatus, string>;

export const CONFLICT_FIELD_LABELS = {
  AMOUNT: "금액",
  DATE: "날짜",
  COUNTERPARTY: "상대방",
  OTHER: "내용",
} satisfies Record<ConflictField, string>;

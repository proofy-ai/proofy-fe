import type { CaseStatus, InflowType } from "@/types/api";

export const INFLOW_TYPE_LABELS = {
  SALARY: "급여",
  GOODS: "물품 거래",
  UNEXPECTED: "모르는 입금",
  OTHER: "기타",
} satisfies Record<InflowType, string>;

export const CASE_STATUS_LABELS = {
  DRAFT: "입력 중",
  ANALYZING: "분석 중",
  REVIEW_READY: "결과 있음",
  ERROR: "분석 실패",
} satisfies Record<CaseStatus, string>;

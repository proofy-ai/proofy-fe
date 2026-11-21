import type { ChecklistCategory, DocType } from "@/types/api";

export const DOC_TYPE_LABELS = {
  NOTICE: "지급정지 통지서",
  TRANSACTION_RECORD: "거래내역서",
  INSURANCE_ELIGIBILITY: "건강보험자격득실확인서",
  EMPLOYMENT_CERT: "재직증명서",
  PAYSLIP: "급여명세서",
  BUSINESS_REG: "사업자등록증명",
  CHAT: "대화내역",
  CONTRACT: "계약서",
  TAX_INVOICE: "세금계산서",
  TRANSACTION_STATEMENT: "거래명세서",
  SHIPPING: "배송 기록",
  OTHER: "기타",
} satisfies Record<DocType, string>;

export const CHECKLIST_CATEGORY_ORDER = [
  "OFFICIAL_REQUIRED",
  "TYPE_GUIDE",
  "ANALYSIS_INPUT",
  "OPTIONAL",
  "AI_RECOMMENDED",
] satisfies ChecklistCategory[];

export const CHECKLIST_CATEGORY_TITLES = {
  OFFICIAL_REQUIRED: "법령상 제출 서류",
  TYPE_GUIDE: "유형별 안내 서류",
  ANALYSIS_INPUT: "AI 분석에 필요한 자료",
  OPTIONAL: "있으면 좋은 자료",
  AI_RECOMMENDED: "AI가 더 권한 서류",
} satisfies Record<ChecklistCategory, string>;

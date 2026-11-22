import type { InflowType } from "@/types/api";

export const INFLOW_TYPE_LABELS = {
  SALARY: "급여",
  GOODS: "물품 거래",
  UNEXPECTED: "모르는 입금",
  OTHER: "기타",
} satisfies Record<InflowType, string>;

export const getCaseProgress = (hasResult: boolean) =>
  hasResult
    ? ({ tone: "success", label: "완료" } as const)
    : ({ tone: "warning", label: "진행 중" } as const);

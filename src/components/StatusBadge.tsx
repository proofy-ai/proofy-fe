import type { ReactNode } from "react";

import { FINDING_STATUS_LABELS } from "@/lib/findingLabels";
import type { ChecklistStatus, FindingStatus } from "@/types/api";

type BadgeTone = "info" | "success" | "warning" | "danger" | "neutral";

const toneStyles: Record<BadgeTone, string> = {
  info: "bg-brand-pale text-brand-strong",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  danger: "bg-danger/15 text-danger",
  neutral: "bg-gray-200 text-ink-sub",
};

const checklistStatusBadges: Record<
  ChecklistStatus,
  { tone: BadgeTone; label: string }
> = {
  SATISFIED: { tone: "success", label: "올림" },
  MISSING: { tone: "danger", label: "없음" },
  NOT_COLLECTED: { tone: "neutral", label: "직접 첨부" },
  GUIDE_ONLY: { tone: "neutral", label: "은행에서 작성" },
};

type StatusBadgeProps = {
  tone: BadgeTone;
  children: ReactNode;
};

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
}

type ChecklistStatusBadgeProps = {
  status: ChecklistStatus;
  isPreparedSeparately?: boolean;
};

export function ChecklistStatusBadge({
  status,
  isPreparedSeparately = false,
}: ChecklistStatusBadgeProps) {
  if (status === "MISSING" && isPreparedSeparately) {
    return <StatusBadge tone="info">따로 준비함</StatusBadge>;
  }

  const { tone, label } = checklistStatusBadges[status];
  return <StatusBadge tone={tone}>{label}</StatusBadge>;
}

export function AnalysisRequiredBadge() {
  return <StatusBadge tone="info">AI 분석에 필요</StatusBadge>;
}

export function NeedsCheckBadge() {
  return <StatusBadge tone="warning">확인 필요</StatusBadge>;
}

export function ConfirmedBadge() {
  return <StatusBadge tone="success">직접 확인함</StatusBadge>;
}

const findingStatusTones: Record<FindingStatus, BadgeTone> = {
  MATCH: "success",
  CONFLICT: "danger",
  STATEMENT_ONLY: "warning",
  UNKNOWN: "neutral",
};

export function FindingStatusBadge({ status }: { status: FindingStatus }) {
  return (
    <StatusBadge tone={findingStatusTones[status]}>
      {FINDING_STATUS_LABELS[status]}
    </StatusBadge>
  );
}

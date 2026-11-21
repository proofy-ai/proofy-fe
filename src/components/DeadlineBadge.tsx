import type { Deadline, DeadlineState } from "@/types/api";

const badgeStyles: Record<DeadlineState, string> = {
  OK: "bg-brand-soft text-brand-strong",
  URGENT: "bg-warning-soft text-warning",
  EXPIRED: "bg-danger-soft text-danger",
  UNKNOWN_NOTICE_DATE: "bg-surface text-ink-sub",
};

type DeadlineBadgeProps = {
  deadline: Deadline;
};

export function DeadlineBadge({ deadline }: DeadlineBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-1 text-sm font-bold ${badgeStyles[deadline.state]}`}
    >
      {deadline.label}
    </span>
  );
}

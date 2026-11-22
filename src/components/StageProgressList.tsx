import { Check, ScanLine, X } from "lucide-react";
import { type ReactNode, useState } from "react";

import { StageSegmentBar } from "@/components/StageSegmentBar";
import { STAGE_LABELS } from "@/lib/stageLabels";
import type { StageProgress, StageStatus } from "@/types/api";

const stageIcons: Record<StageStatus, ReactNode> = {
  DONE: (
    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-success text-success">
      <Check className="h-3.5 w-3.5" aria-hidden />
    </span>
  ),
  RUNNING: <ScanLine className="h-6 w-6 text-brand-strong" aria-hidden />,
  PENDING: <span className="h-6 w-6 rounded-full bg-brand-line" />,
  FAILED: (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white">
      <X className="h-3.5 w-3.5" aria-hidden />
    </span>
  ),
};

const stageStatusLabels: Record<StageStatus, ReactNode> = {
  DONE: <Check className="h-4 w-4 text-success" aria-hidden />,
  RUNNING: <span className="text-xs text-brand-strong">분석 중</span>,
  PENDING: null,
  FAILED: <span className="text-xs text-danger">실패</span>,
};

type StageProgressListProps = {
  stages: StageProgress[];
};

function StageRow({ stage }: { stage: StageProgress }) {
  const [hasRun, setHasRun] = useState(false);
  if (stage.status === "RUNNING" && !hasRun) setHasRun(true);
  const isRunning = stage.status === "RUNNING";
  const justCompleted = hasRun && stage.status === "DONE";

  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        {stageIcons[stage.status]}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span
          className={`break-keep text-sm ${
            stage.status === "PENDING"
              ? "text-ink-faint"
              : "font-semibold text-ink"
          }`}
        >
          {STAGE_LABELS[stage.key]}
        </span>
        {(isRunning || justCompleted) && (
          <StageSegmentBar stageKey={stage.key} isComplete={justCompleted} />
        )}
      </div>
      <span className="flex h-6 shrink-0 items-center">
        {stageStatusLabels[stage.status]}
      </span>
    </li>
  );
}

export function StageProgressList({ stages }: StageProgressListProps) {
  return (
    <ol className="flex w-full flex-col gap-5">
      {stages.map((stage) => (
        <StageRow key={stage.key} stage={stage} />
      ))}
    </ol>
  );
}

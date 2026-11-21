import { Check, Circle, Loader2, X } from "lucide-react";
import type { ReactNode } from "react";

import type { StageProgress, StageStatus } from "@/types/api";

const stageIcons: Record<StageStatus, ReactNode> = {
  DONE: <Check className="h-4 w-4 text-white" aria-hidden />,
  RUNNING: <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden />,
  PENDING: <Circle className="h-3 w-3 text-ink-mark" aria-hidden />,
  FAILED: <X className="h-4 w-4 text-white" aria-hidden />,
};

const stageMarkerStyles: Record<StageStatus, string> = {
  DONE: "bg-brand",
  RUNNING: "bg-brand",
  PENDING: "bg-surface",
  FAILED: "bg-danger",
};

type StageProgressListProps = {
  stages: StageProgress[];
};

export default function StageProgressList({ stages }: StageProgressListProps) {
  return (
    <ol className="flex flex-col gap-3">
      {stages.map((stage) => (
        <li key={stage.key} className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full ${stageMarkerStyles[stage.status]}`}
          >
            {stageIcons[stage.status]}
          </span>
          <span
            className={
              stage.status === "PENDING"
                ? "text-ink-faint"
                : "font-medium text-ink"
            }
          >
            {stage.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

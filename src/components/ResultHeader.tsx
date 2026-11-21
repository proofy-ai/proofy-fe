import { DeadlineBadge } from "@/components/DeadlineBadge";
import type { Deadline } from "@/types/api";

type Props = {
  aiNotice: string;
  deadline: Deadline;
};

export function ResultHeader({ aiNotice, deadline }: Props) {
  return (
    <div className="sticky top-0 z-10 flex items-start gap-3 rounded-2xl bg-white/90 p-3 backdrop-blur">
      <DeadlineBadge deadline={deadline} />
      <p className="break-keep text-sm text-ink-sub">{aiNotice}</p>
    </div>
  );
}

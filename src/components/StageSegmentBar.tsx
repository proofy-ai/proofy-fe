import { useStaggeredCount } from "@/hooks/useStaggeredCount";
import type { Stage } from "@/types/api";

const SEGMENT_COUNT = 14;
const SEGMENT_FILL_INTERVAL_MS: Record<Stage, number> = {
  EXTRACTING: 1200,
  COMPARING: 2200,
  DRAFTING: 600,
  FINISHED: 600,
};

type Props = {
  stageKey: Stage;
};

export function StageSegmentBar({ stageKey }: Props) {
  const filledCount = useStaggeredCount(
    SEGMENT_COUNT - 1,
    SEGMENT_FILL_INTERVAL_MS[stageKey],
  );

  return (
    <div aria-hidden className="flex w-full gap-1">
      {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
        <span
          key={index}
          className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
            index < filledCount ? "bg-brand-strong" : "bg-brand-line"
          }`}
        />
      ))}
    </div>
  );
}

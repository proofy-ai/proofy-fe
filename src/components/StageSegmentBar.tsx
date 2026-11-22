import { useStaggeredCount } from "@/hooks/useStaggeredCount";
import type { Stage } from "@/types/api";

const SEGMENT_COUNT = 14;
const SEGMENT_FILL_INTERVAL_MS: Record<Stage, number> = {
  EXTRACTING: 1200,
  COMPARING: 2200,
  DRAFTING: 600,
  FINISHED: 600,
};
const COMPLETE_SWEEP_MS = 22;

type Props = {
  stageKey: Stage;
  isComplete?: boolean;
};

export function StageSegmentBar({ stageKey, isComplete = false }: Props) {
  const stepCount = useStaggeredCount(
    SEGMENT_COUNT - 1,
    SEGMENT_FILL_INTERVAL_MS[stageKey],
  );
  const filledCount = isComplete ? SEGMENT_COUNT : stepCount;

  return (
    <div
      aria-hidden
      className={`flex w-full gap-1 overflow-hidden ${
        isComplete ? "animate-bar-finish motion-reduce:animate-none" : ""
      }`}
    >
      {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
        <span
          key={index}
          style={{
            transitionDelay: isComplete
              ? `${index * COMPLETE_SWEEP_MS}ms`
              : "0ms",
          }}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            index < filledCount ? "bg-brand-strong" : "bg-brand-line"
          }`}
        />
      ))}
    </div>
  );
}

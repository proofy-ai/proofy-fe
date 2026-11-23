import { AnalysisHero } from "@/components/AnalysisHero";
import { AnalysisStepFeed } from "@/components/AnalysisStepFeed";
import { GlassCard } from "@/components/common/GlassCard";
import { StageProgressList } from "@/components/StageProgressList";
import { useStaggeredCount } from "@/hooks/useStaggeredCount";
import { STEP_REVEAL_INTERVAL_MS } from "@/lib/analysisRun";
import { expandPlanSteps } from "@/lib/investigationPlan";
import type { AnalysisStep, StageProgress } from "@/types/api";

type Props = {
  stages: StageProgress[];
  steps: AnalysisStep[];
};

export function AnalysisProgressPanel({ stages, steps }: Props) {
  const timelineSteps = expandPlanSteps(steps);
  const revealedCount = useStaggeredCount(
    timelineSteps.length,
    STEP_REVEAL_INTERVAL_MS,
  );
  const newestFirstSteps = timelineSteps.slice(0, revealedCount).reverse();

  return (
    <>
      <GlassCard>
        <div className="flex w-full flex-col gap-6">
          <AnalysisHero />
          <StageProgressList stages={stages} />
        </div>
      </GlassCard>
      {newestFirstSteps.length > 0 && (
        <AnalysisStepFeed steps={newestFirstSteps} />
      )}
    </>
  );
}

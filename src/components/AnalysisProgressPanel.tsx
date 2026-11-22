import { GlassCard } from "@/components/common/GlassCard";
import { StageProgressList } from "@/components/StageProgressList";
import type { AnalysisStep, StageProgress } from "@/types/api";

type Props = {
  stages: StageProgress[];
  steps: AnalysisStep[];
};

export function AnalysisProgressPanel({ stages, steps }: Props) {
  const newestFirstSteps = [...steps].reverse();

  return (
    <GlassCard title="진행 단계">
      <div className="flex w-full flex-col gap-5">
        <StageProgressList stages={stages} />
        {newestFirstSteps.length > 0 && (
          <ul className="flex flex-col gap-4 border-t border-brand-line pt-4">
            {newestFirstSteps.map((step) => (
              <li key={step.seq} className="flex flex-col gap-0.5">
                <span className="break-keep text-sm font-medium text-ink">
                  {step.title}
                </span>
                <span className="break-keep text-sm text-ink-sub">
                  {step.summary}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </GlassCard>
  );
}

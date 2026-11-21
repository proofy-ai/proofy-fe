import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";

type Props = {
  blockers: string[];
  errorMessage: string | null;
  isPending: boolean;
  onStart: () => void;
};

export function AnalysisStartPanel({
  blockers,
  errorMessage,
  isPending,
  onStart,
}: Props) {
  return (
    <GlassCard title="분석 시작">
      <div className="flex w-full flex-col gap-3">
        {blockers.length > 0 && (
          <ul className="flex flex-col gap-1">
            {blockers.map((blocker) => (
              <li key={blocker} className="break-keep text-sm text-ink-sub">
                · {blocker}
              </li>
            ))}
          </ul>
        )}
        {errorMessage && (
          <p role="alert" className="whitespace-pre-line text-sm text-danger">
            {errorMessage}
          </p>
        )}
        <GradientButton
          fullWidth
          disabled={blockers.length > 0 || isPending}
          onClick={onStart}
        >
          분석 시작
        </GradientButton>
      </div>
    </GlassCard>
  );
}

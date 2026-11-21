import { Link } from "react-router-dom";

import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";

type Props = {
  message: string;
  evidencePath: string;
  isPending: boolean;
  errorMessage: string | null;
  onRetry: () => void;
};

export function AnalysisRetryPanel({
  message,
  evidencePath,
  isPending,
  errorMessage,
  onRetry,
}: Props) {
  return (
    <GlassCard title="분석을 마치지 못했어요">
      <div className="flex w-full flex-col gap-3">
        <p className="whitespace-pre-line break-keep text-ink-sub">{message}</p>
        {errorMessage && (
          <p role="alert" className="whitespace-pre-line text-sm text-danger">
            {errorMessage}
          </p>
        )}
        <GradientButton fullWidth disabled={isPending} onClick={onRetry}>
          다시 시도
        </GradientButton>
        <Link
          to={evidencePath}
          className="text-center text-sm text-ink underline"
        >
          서류 다시 확인하기
        </Link>
      </div>
    </GlassCard>
  );
}

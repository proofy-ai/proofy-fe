import { Navigate, useParams } from "react-router-dom";

import { AnalysisProgressPanel } from "@/components/AnalysisProgressPanel";
import { AnalysisRetryPanel } from "@/components/AnalysisRetryPanel";
import { ErrorState, LoadingState } from "@/components/StateViews";
import { StoredCaseGuard } from "@/components/StoredCaseGuard";
import { useAnalysisRetry } from "@/hooks/useAnalysisRetry";
import { useAnalysisRun } from "@/hooks/useAnalysisRun";
import { getEvidencePath } from "@/lib/casePaths";

const TIMEOUT_MESSAGE =
  "분석이 생각보다 오래 걸리고 있어요.\n잠시 뒤 다시 시도해 주세요.";

type ScreenProps = {
  caseId: string;
  caseToken: string;
};

function AnalysisScreen({ caseId, caseToken }: ScreenProps) {
  const { run, isTimedOut, hasNoRun, error, refetchCase } = useAnalysisRun(
    caseId,
    caseToken,
  );
  const retry = useAnalysisRetry(caseId, caseToken);

  if (error) {
    return <ErrorState message={error.message} onRetry={refetchCase} />;
  }
  if (hasNoRun) return <Navigate to={getEvidencePath(caseId)} replace />;
  if (!run) return <LoadingState />;

  const failureMessage =
    run.status === "FAILED" ? (run.error?.message ?? null) : null;
  const retryMessage = isTimedOut ? TIMEOUT_MESSAGE : failureMessage;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">
        프루피 AI가 서류를 읽고 정리하고 있어요
      </h1>
      <AnalysisProgressPanel stages={run.stages} steps={run.steps} />
      {retryMessage && (
        <AnalysisRetryPanel
          message={retryMessage}
          evidencePath={getEvidencePath(caseId)}
          isPending={retry.isPending}
          errorMessage={retry.errorMessage}
          onRetry={retry.retry}
        />
      )}
    </div>
  );
}

export function Analysis() {
  const { caseId = "" } = useParams();

  return (
    <StoredCaseGuard caseId={caseId}>
      {(storedCase) => (
        <AnalysisScreen
          caseId={storedCase.caseId}
          caseToken={storedCase.caseToken}
        />
      )}
    </StoredCaseGuard>
  );
}

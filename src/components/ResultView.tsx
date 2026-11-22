import { OverwriteDraftConfirm } from "@/components/OverwriteDraftConfirm";
import { ReferralCard } from "@/components/ReferralCard";
import { ResultBanners } from "@/components/ResultBanners";
import { ResultTabsFlow } from "@/components/ResultTabsFlow";
import { useAnalysisRetry } from "@/hooks/useAnalysisRetry";
import type { AnalysisResult } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  result: AnalysisResult;
};

export function ResultView({ caseId, caseToken, result }: Props) {
  const reanalysis = useAnalysisRetry(caseId, caseToken);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <ResultBanners
        isStale={result.isStale}
        precomputed={result.precomputed}
        isReanalyzing={reanalysis.isPending}
        errorMessage={reanalysis.errorMessage}
        onReanalyze={() => reanalysis.retry()}
      />
      <OverwriteDraftConfirm
        isOpen={reanalysis.needsOverwriteConfirm}
        onConfirm={() => reanalysis.retry(true)}
        onClose={reanalysis.dismissError}
      />
      {result.referral ? (
        <ReferralCard referral={result.referral} />
      ) : (
        <ResultTabsFlow caseId={caseId} caseToken={caseToken} result={result} />
      )}
    </div>
  );
}

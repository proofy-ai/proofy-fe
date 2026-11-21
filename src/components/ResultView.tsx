import { useState } from "react";

import { OverwriteDraftConfirm } from "@/components/OverwriteDraftConfirm";
import { ReferralCard } from "@/components/ReferralCard";
import { ResultBanners } from "@/components/ResultBanners";
import { ResultHeader } from "@/components/ResultHeader";
import { ResultTabPanel } from "@/components/ResultTabPanel";
import { type ResultTabKey, ResultTabs } from "@/components/ResultTabs";
import { useAnalysisRetry } from "@/hooks/useAnalysisRetry";
import { useFindingFocus } from "@/hooks/useFindingFocus";
import type { AnalysisResult } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  result: AnalysisResult;
};

export function ResultView({ caseId, caseToken, result }: Props) {
  const [activeTab, setActiveTab] = useState<ResultTabKey>("FINDINGS");
  const reanalysis = useAnalysisRetry(caseId, caseToken);
  const showFinding = useFindingFocus(activeTab, setActiveTab);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <ResultHeader aiNotice={result.aiNotice} deadline={result.deadline} />
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
        <>
          <ResultTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <ResultTabPanel
            activeTab={activeTab}
            caseId={caseId}
            caseToken={caseToken}
            result={result}
            onShowFinding={showFinding}
          />
        </>
      )}
    </div>
  );
}

import { useState } from "react";

import { FindingsTab } from "@/components/FindingsTab";
import { ReferralCard } from "@/components/ReferralCard";
import { ResultBanners } from "@/components/ResultBanners";
import { ResultHeader } from "@/components/ResultHeader";
import { type ResultTabKey, ResultTabs } from "@/components/ResultTabs";
import { EmptyState } from "@/components/StateViews";
import { useAnalysisRetry } from "@/hooks/useAnalysisRetry";
import type { AnalysisResult } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  result: AnalysisResult;
};

export function ResultView({ caseId, caseToken, result }: Props) {
  const [activeTab, setActiveTab] = useState<ResultTabKey>("FINDINGS");
  const reanalysis = useAnalysisRetry(caseId, caseToken);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <ResultHeader aiNotice={result.aiNotice} deadline={result.deadline} />
      <ResultBanners
        isStale={result.isStale}
        precomputed={result.precomputed}
        isReanalyzing={reanalysis.isPending}
        errorMessage={reanalysis.errorMessage}
        onReanalyze={reanalysis.retry}
      />
      {result.referral ? (
        <ReferralCard referral={result.referral} />
      ) : (
        <>
          <ResultTabs activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === "FINDINGS" && <FindingsTab result={result} />}
          {activeTab !== "FINDINGS" && <EmptyState title="준비 중이에요" />}
        </>
      )}
    </div>
  );
}

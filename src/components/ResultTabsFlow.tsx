import { useState } from "react";
import { useLocation } from "react-router-dom";

import { GradientButton } from "@/components/common/GradientButton";
import { ResultTabPanel } from "@/components/ResultTabPanel";
import { ResultTabs } from "@/components/ResultTabs";
import { useFindingFocus } from "@/hooks/useFindingFocus";
import {
  getNextTab,
  getResultTabFromState,
  type ResultTabKey,
} from "@/lib/resultTabs";
import type { AnalysisResult } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  result: AnalysisResult;
};

export function ResultTabsFlow({ caseId, caseToken, result }: Props) {
  const { state } = useLocation();
  const [activeTab, setActiveTab] = useState<ResultTabKey>(
    getResultTabFromState(state) ?? "FINDINGS",
  );
  const showFinding = useFindingFocus(activeTab, setActiveTab);
  const nextTab = getNextTab(activeTab);

  const handleTabChange = (tab: ResultTabKey) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <ResultTabs activeTab={activeTab} onTabChange={handleTabChange} />
      <ResultTabPanel
        activeTab={activeTab}
        caseId={caseId}
        caseToken={caseToken}
        result={result}
        onShowFinding={showFinding}
        onGoToDraft={() => handleTabChange("DRAFT")}
      />
      {nextTab && (
        <GradientButton fullWidth onClick={() => handleTabChange(nextTab.key)}>
          {nextTab.actionLabel}
        </GradientButton>
      )}
    </>
  );
}

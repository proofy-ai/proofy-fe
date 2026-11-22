import { DraftTab } from "@/components/DraftTab";
import { FindingsTab } from "@/components/FindingsTab";
import { GuideTab } from "@/components/GuideTab";
import { MissingDocumentsTab } from "@/components/MissingDocumentsTab";
import type { ResultTabKey } from "@/lib/resultTabs";
import type { AnalysisResult } from "@/types/api";

type Props = {
  activeTab: ResultTabKey;
  caseId: string;
  caseToken: string;
  result: AnalysisResult;
  onShowFinding: (findingId: string) => void;
  onGoToDraft: () => void;
};

export function ResultTabPanel({
  activeTab,
  caseId,
  caseToken,
  result,
  onShowFinding,
  onGoToDraft,
}: Props) {
  if (activeTab === "FINDINGS") return <FindingsTab result={result} />;
  if (activeTab === "MISSING") {
    return (
      <MissingDocumentsTab
        caseId={caseId}
        caseToken={caseToken}
        checklist={result.checklist}
      />
    );
  }
  if (activeTab === "GUIDE") {
    return (
      <GuideTab
        caseId={caseId}
        caseToken={caseToken}
        result={result}
        onGoToDraft={onGoToDraft}
      />
    );
  }
  return (
    <DraftTab
      caseId={caseId}
      caseToken={caseToken}
      draft={result.draft}
      questions={result.agentReview?.questions ?? []}
      onShowFinding={onShowFinding}
    />
  );
}

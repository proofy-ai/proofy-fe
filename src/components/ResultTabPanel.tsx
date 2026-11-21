import { DraftTab } from "@/components/DraftTab";
import { FindingsTab } from "@/components/FindingsTab";
import { MissingDocumentsTab } from "@/components/MissingDocumentsTab";
import type { ResultTabKey } from "@/components/ResultTabs";
import type { AnalysisResult } from "@/types/api";

type Props = {
  activeTab: ResultTabKey;
  caseId: string;
  caseToken: string;
  result: AnalysisResult;
  onShowFinding: (findingId: string) => void;
};

export function ResultTabPanel({
  activeTab,
  caseId,
  caseToken,
  result,
  onShowFinding,
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
  return (
    <DraftTab
      caseId={caseId}
      caseToken={caseToken}
      draft={result.draft}
      onShowFinding={onShowFinding}
    />
  );
}

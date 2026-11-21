import { DeleteCasePanel } from "@/components/DeleteCasePanel";
import { DraftCopyPanel } from "@/components/DraftCopyPanel";
import { GuideFinalCheck } from "@/components/GuideFinalCheck";
import { GuideSubmitInfo } from "@/components/GuideSubmitInfo";
import { EmptyState } from "@/components/StateViews";
import type { AnalysisResult } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  result: AnalysisResult;
  onGoToDraft: () => void;
};

export function GuideTab({ caseId, caseToken, result, onGoToDraft }: Props) {
  if (!result.draft) return <EmptyState title="아직 만든 초안이 없어요" />;

  return (
    <div className="flex flex-col gap-6">
      <GuideFinalCheck
        summary={result.summary}
        unconfirmedCount={result.draft.unconfirmedCount}
      />
      <DraftCopyPanel draft={result.draft} onGoToDraft={onGoToDraft} />
      <GuideSubmitInfo />
      <DeleteCasePanel caseId={caseId} caseToken={caseToken} />
    </div>
  );
}

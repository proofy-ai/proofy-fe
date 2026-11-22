import { useParams } from "react-router-dom";

import { CaseErrorState } from "@/components/CaseErrorState";
import { ResultView } from "@/components/ResultView";
import { LoadingState } from "@/components/StateViews";
import { StoredCaseGuard } from "@/components/StoredCaseGuard";
import { useAnalysisResult } from "@/hooks/useAnalysisResult";

type ScreenProps = {
  caseId: string;
  caseToken: string;
};

function ResultScreen({ caseId, caseToken }: ScreenProps) {
  const resultQuery = useAnalysisResult(caseId, caseToken);

  if (resultQuery.isPending) return <LoadingState />;
  if (resultQuery.isError) {
    return (
      <CaseErrorState
        error={resultQuery.error}
        onRetry={() => resultQuery.refetch()}
      />
    );
  }

  return (
    <ResultView
      caseId={caseId}
      caseToken={caseToken}
      result={resultQuery.data}
    />
  );
}

export function Result() {
  const { caseId = "" } = useParams();

  return (
    <StoredCaseGuard caseId={caseId}>
      {(storedCase) => (
        <ResultScreen
          caseId={storedCase.caseId}
          caseToken={storedCase.caseToken}
        />
      )}
    </StoredCaseGuard>
  );
}

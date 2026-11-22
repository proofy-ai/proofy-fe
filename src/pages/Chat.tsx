import { Navigate, useParams } from "react-router-dom";

import { CaseErrorState } from "@/components/CaseErrorState";
import { ChatView } from "@/components/ChatView";
import { LoadingState } from "@/components/StateViews";
import { StoredCaseGuard } from "@/components/StoredCaseGuard";
import { useAnalysisResult } from "@/hooks/useAnalysisResult";
import { getResultPath } from "@/lib/casePaths";

type ScreenProps = {
  caseId: string;
  caseToken: string;
};

function ChatScreen({ caseId, caseToken }: ScreenProps) {
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

  const result = resultQuery.data;
  const questions = result.agentReview?.questions ?? [];
  if (result.referral || questions.length === 0) {
    return <Navigate to={getResultPath(caseId)} replace />;
  }

  return (
    <ChatView caseId={caseId} caseToken={caseToken} questions={questions} />
  );
}

export function Chat() {
  const { caseId = "" } = useParams();

  return (
    <StoredCaseGuard caseId={caseId}>
      {(storedCase) => (
        <ChatScreen
          caseId={storedCase.caseId}
          caseToken={storedCase.caseToken}
        />
      )}
    </StoredCaseGuard>
  );
}

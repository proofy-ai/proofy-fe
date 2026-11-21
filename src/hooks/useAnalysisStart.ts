import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { startAnalysis } from "@/api/analysis";
import { ApiError } from "@/api/client";
import { getServerMissingItems } from "@/lib/analysisReadiness";
import { getAnalysisPath } from "@/lib/casePaths";

export const useAnalysisStart = (
  caseId: string,
  caseToken: string,
  narrative: string,
) => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: () =>
      startAnalysis(caseId, caseToken, {
        narrative,
        overwriteEditedDraft: false,
      }),
  });

  const start = () =>
    mutation.mutate(undefined, {
      onSuccess: () => navigate(getAnalysisPath(caseId)),
      onError: (error) => {
        if (
          error instanceof ApiError &&
          error.code === "ANALYSIS_IN_PROGRESS"
        ) {
          navigate(getAnalysisPath(caseId));
        }
      },
    });

  return {
    start,
    isPending: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
    missingItems:
      mutation.error instanceof ApiError
        ? getServerMissingItems(mutation.error)
        : [],
  };
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { startAnalysis } from "@/api/analysis";
import { ApiError } from "@/api/client";
import { getServerMissingItems } from "@/lib/analysisReadiness";
import { DRAFT_HAS_EDITS_CODE } from "@/lib/analysisRun";
import { getAnalysisPath } from "@/lib/casePaths";

export const useAnalysisStart = (
  caseId: string,
  caseToken: string,
  narrative: string,
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (overwriteEditedDraft: boolean) =>
      startAnalysis(caseId, caseToken, { narrative, overwriteEditedDraft }),
  });

  const start = (overwriteEditedDraft = false) =>
    mutation.mutate(overwriteEditedDraft, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["case", caseId] });
        navigate(getAnalysisPath(caseId));
      },
      onError: (error) => {
        if (
          error instanceof ApiError &&
          error.code === "ANALYSIS_IN_PROGRESS"
        ) {
          navigate(getAnalysisPath(caseId));
        }
      },
    });

  const needsOverwriteConfirm =
    mutation.error instanceof ApiError &&
    mutation.error.code === DRAFT_HAS_EDITS_CODE;

  return {
    start,
    isPending: mutation.isPending,
    errorMessage: needsOverwriteConfirm
      ? null
      : (mutation.error?.message ?? null),
    needsOverwriteConfirm,
    dismissError: mutation.reset,
    missingItems:
      mutation.error instanceof ApiError
        ? getServerMissingItems(mutation.error)
        : [],
  };
};

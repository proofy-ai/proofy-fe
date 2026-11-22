import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { startAnalysis } from "@/api/analysis";
import { ApiError } from "@/api/client";
import { DRAFT_HAS_EDITS_CODE } from "@/lib/analysisRun";
import { getAnalysisPath } from "@/lib/casePaths";

export const useAnalysisRetry = (caseId: string, caseToken: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (overwriteEditedDraft: boolean) =>
      startAnalysis(caseId, caseToken, { overwriteEditedDraft }),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["case", caseId] });
      navigate(getAnalysisPath(caseId), { state: { afterAnalysis: "result" } });
    },
  });

  const needsOverwriteConfirm =
    mutation.error instanceof ApiError &&
    mutation.error.code === DRAFT_HAS_EDITS_CODE;

  return {
    retry: (overwriteEditedDraft = false) =>
      mutation.mutate(overwriteEditedDraft),
    isPending: mutation.isPending,
    errorMessage: needsOverwriteConfirm
      ? null
      : (mutation.error?.message ?? null),
    needsOverwriteConfirm,
    dismissError: mutation.reset,
  };
};

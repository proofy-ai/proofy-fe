import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { startAnalysis } from "@/api/analysis";
import { getAnalysisPath } from "@/lib/casePaths";

export const useAnalysisRetry = (caseId: string, caseToken: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      startAnalysis(caseId, caseToken, { overwriteEditedDraft: false }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      navigate(getAnalysisPath(caseId));
    },
  });

  return {
    retry: () => mutation.mutate(),
    isPending: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

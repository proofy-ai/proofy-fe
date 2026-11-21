import { useMutation, useQueryClient } from "@tanstack/react-query";

import { startAnalysis } from "@/api/analysis";

export const useAnalysisRetry = (caseId: string, caseToken: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      startAnalysis(caseId, caseToken, { overwriteEditedDraft: false }),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["case", caseId] }),
  });

  return {
    retry: () => mutation.mutate(),
    isPending: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

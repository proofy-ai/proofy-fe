import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { startAnalysis } from "@/api/analysis";
import { getAnalysisPath } from "@/lib/casePaths";
import type { AnswerInput } from "@/types/api";

export const useReanalysisWithAnswers = (caseId: string, caseToken: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (answers: AnswerInput[]) =>
      startAnalysis(caseId, caseToken, { answers }),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["case", caseId] });
      queryClient.removeQueries({ queryKey: ["result", caseId] });
      navigate(getAnalysisPath(caseId), { state: { afterAnalysis: "result" } });
    },
  });

  return {
    reanalyze: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.error?.message ?? null,
  };
};

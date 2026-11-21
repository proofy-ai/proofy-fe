import { useQuery } from "@tanstack/react-query";

import { getAnalysisResult } from "@/api/result";

export const useAnalysisResult = (caseId: string, caseToken: string) =>
  useQuery({
    queryKey: ["result", caseId],
    queryFn: () => getAnalysisResult(caseId, caseToken),
    retry: false,
  });

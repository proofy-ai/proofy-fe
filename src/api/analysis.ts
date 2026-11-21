import { request } from "@/api/client";
import type { AnalysisStart, AnalysisStartResponse } from "@/types/api";

export const startAnalysis = (
  caseId: string,
  caseToken: string,
  body: AnalysisStart,
) =>
  request<AnalysisStartResponse>(`/cases/${caseId}/analysis-runs`, {
    method: "POST",
    caseToken,
    body,
  });

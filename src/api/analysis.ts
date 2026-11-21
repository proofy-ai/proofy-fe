import { request } from "@/api/client";
import type {
  AnalysisRun,
  AnalysisStart,
  AnalysisStartResponse,
} from "@/types/api";

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

export const getAnalysisRun = (
  caseId: string,
  caseToken: string,
  runId: string,
) =>
  request<AnalysisRun>(`/cases/${caseId}/analysis-runs/${runId}`, {
    caseToken,
  });

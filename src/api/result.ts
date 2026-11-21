import { request } from "@/api/client";
import type { AnalysisResult } from "@/types/api";

export const getAnalysisResult = (caseId: string, caseToken: string) =>
  request<AnalysisResult>(`/cases/${caseId}/result`, { caseToken });

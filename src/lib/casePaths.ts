import type { CaseDetail } from "@/types/api";

export const NEW_CASE_PATH = "/cases/new";

export const getAnalysisPath = (caseId: string) => `/cases/${caseId}/analysis`;

export const getEvidencePath = (caseId: string) => `/cases/${caseId}/evidence`;

export const getDonePath = (caseId: string) => `/cases/${caseId}/done`;

export const getChatPath = (caseId: string) => `/cases/${caseId}/chat`;

export const getResultPath = (caseId: string) => `/cases/${caseId}/result`;

export const getContinuePath = ({
  caseId,
  hasResult,
  latestRun,
}: Pick<CaseDetail, "caseId" | "hasResult" | "latestRun">) => {
  if (latestRun?.status === "RUNNING") return getAnalysisPath(caseId);
  if (hasResult) return getResultPath(caseId);
  return getEvidencePath(caseId);
};

import type { CaseDetail } from "@/types/api";

export const NEW_CASE_PATH = "/cases/new";

export const getContinuePath = ({
  caseId,
  hasResult,
  latestRun,
}: Pick<CaseDetail, "caseId" | "hasResult" | "latestRun">) => {
  if (latestRun?.status === "RUNNING") return `/cases/${caseId}/analysis`;
  if (hasResult) return `/cases/${caseId}/result`;
  return `/cases/${caseId}/evidence`;
};

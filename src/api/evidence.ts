import { request } from "@/api/client";
import type { DocType, Evidence } from "@/types/api";

export const listEvidence = (caseId: string, caseToken: string) =>
  request<{ items: Evidence[] }>(`/cases/${caseId}/evidence`, { caseToken });

export const uploadEvidence = (
  caseId: string,
  caseToken: string,
  file: File,
  docType: DocType,
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("docType", docType);
  return request<{ evidence: Evidence }>(`/cases/${caseId}/evidence`, {
    method: "POST",
    caseToken,
    formData,
  });
};

export const deleteEvidence = (
  caseId: string,
  caseToken: string,
  evidenceId: string,
) =>
  request<void>(`/cases/${caseId}/evidence/${evidenceId}`, {
    method: "DELETE",
    caseToken,
  });

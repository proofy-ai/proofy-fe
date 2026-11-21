import { request } from "@/api/client";
import type { DraftResponse, DraftUpdate } from "@/types/api";

export const updateDraft = (
  caseId: string,
  caseToken: string,
  body: DraftUpdate,
) =>
  request<DraftResponse>(`/cases/${caseId}/draft`, {
    method: "PUT",
    caseToken,
    body,
  });

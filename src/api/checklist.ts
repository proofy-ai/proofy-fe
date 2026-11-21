import { request } from "@/api/client";
import type { Checklist, ChecklistItem } from "@/types/api";

export const getChecklist = (caseId: string, caseToken: string) =>
  request<Checklist>(`/cases/${caseId}/checklist`, { caseToken });

export const updateChecklistItem = (
  caseId: string,
  caseToken: string,
  itemId: string,
  checked: boolean,
) =>
  request<{ item: ChecklistItem }>(`/cases/${caseId}/checklist/${itemId}`, {
    method: "PATCH",
    caseToken,
    body: { checked },
  });

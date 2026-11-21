import { request } from "@/api/client";
import type { Checklist } from "@/types/api";

export const getChecklist = (caseId: string, caseToken: string) =>
  request<Checklist>(`/cases/${caseId}/checklist`, { caseToken });

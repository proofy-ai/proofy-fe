import { request } from "@/api/client";
import type {
  CaseInput,
  CaseResponse,
  CaseUpdate,
  CreatedCaseResponse,
  SampleScenario,
} from "@/types/api";

export function createCase(input: CaseInput) {
  return request<CreatedCaseResponse>("/cases", {
    method: "POST",
    body: input,
  });
}

export function createSampleCase(scenario: SampleScenario) {
  return request<CreatedCaseResponse>("/cases/sample", {
    method: "POST",
    body: { scenario },
  });
}

export function getCase(caseId: string, caseToken: string) {
  return request<CaseResponse>(`/cases/${caseId}`, { caseToken });
}

export function updateCase(
  caseId: string,
  caseToken: string,
  update: CaseUpdate,
) {
  return request<CaseResponse>(`/cases/${caseId}`, {
    method: "PATCH",
    caseToken,
    body: update,
  });
}

export function deleteCase(caseId: string, caseToken: string) {
  return request<void>(`/cases/${caseId}`, { method: "DELETE", caseToken });
}

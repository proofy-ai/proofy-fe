import type { ApiError } from "@/api/client";
import type { Checklist } from "@/types/api";

const MIN_NARRATIVE_LENGTH = 20;

export const getAnalysisBlockers = (
  narrative: string,
  checklist: Checklist | undefined,
): string[] => {
  const blockers: string[] = [];
  const narrativeLength = narrative.trim().length;

  if (narrativeLength < MIN_NARRATIVE_LENGTH) {
    blockers.push(
      `사연을 ${MIN_NARRATIVE_LENGTH}자 이상 입력해 주세요. (지금 ${narrativeLength}자)`,
    );
  }

  checklist?.items
    .filter((item) => item.requiredForAnalysis && item.status !== "SATISFIED")
    .forEach((item) => blockers.push(`${item.label}를 올려 주세요.`));

  return blockers;
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export const getServerMissingItems = (error: ApiError): string[] => {
  const missing = error.details?.missing;
  return isStringArray(missing) ? missing : [];
};

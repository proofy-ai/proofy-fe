import type { StoredCase } from "@/types/api";

const storageKey = "proofy.cases";
const maxStoredCases = 10;

function isStoredCase(value: unknown): value is StoredCase {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.caseId === "string" &&
    typeof candidate.caseToken === "string"
  );
}

export function readStoredCases(): StoredCase[] {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isStoredCase) : [];
  } catch {
    return [];
  }
}

function writeStoredCases(cases: StoredCase[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cases));
  } catch {
    return;
  }
}

export function addStoredCase(newCase: StoredCase) {
  const otherCases = readStoredCases().filter(
    (storedCase) => storedCase.caseId !== newCase.caseId,
  );
  writeStoredCases([newCase, ...otherCases].slice(0, maxStoredCases));
}

export function removeStoredCase(caseId: string) {
  const remainingCases = readStoredCases().filter(
    (storedCase) => storedCase.caseId !== caseId,
  );
  writeStoredCases(remainingCases);
}

import { createSampleCase, deleteCase, getCase } from "@/api/cases";
import { isCaseGone } from "@/hooks/useMyCases";
import {
  addStoredCase,
  findLatestSampleCase,
  readStoredCases,
  removeStoredCase,
} from "@/lib/caseStorage";
import type { SampleScenario, StoredCase } from "@/types/api";

async function isCaseAlive({ caseId, caseToken }: StoredCase) {
  try {
    await getCase(caseId, caseToken);
    return true;
  } catch (error) {
    if (isCaseGone(error)) return false;
    throw error;
  }
}

function discardOtherTrialCases(scenario: SampleScenario, keepCaseId: string) {
  const otherCases = readStoredCases().filter(
    (storedCase) =>
      storedCase.sampleScenario === scenario &&
      storedCase.caseId !== keepCaseId,
  );

  otherCases.forEach(({ caseId, caseToken }) => {
    removeStoredCase(caseId);
    deleteCase(caseId, caseToken).catch(() => undefined);
  });
}

async function createTrialCase(scenario: SampleScenario) {
  const created = await createSampleCase(scenario);
  addStoredCase({
    caseId: created.caseId,
    caseToken: created.caseToken,
    createdAt: created.case.createdAt,
    sampleScenario: scenario,
  });
  return created.caseId;
}

export async function ensureTrialCase(scenario: SampleScenario) {
  const existingCase = findLatestSampleCase(readStoredCases(), scenario);

  let keepCaseId: string;
  if (existingCase && (await isCaseAlive(existingCase))) {
    keepCaseId = existingCase.caseId;
  } else {
    keepCaseId = await createTrialCase(scenario);
  }

  discardOtherTrialCases(scenario, keepCaseId);
  return keepCaseId;
}

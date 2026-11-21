import { computeDeadline } from "@/mocks/dates";
import { buildRequirementItems } from "@/mocks/requirements";
import type {
  CaseDetail,
  Checklist,
  ChecklistItem,
  Draft,
  Evidence,
  Finding,
  Referral,
  SampleScenario,
  UnreadEvidence,
} from "@/types/api";

export type MockRun = {
  runId: string;
  startedAt: number;
  inputVersionAtStart: number;
  referral: Referral | null;
};

type MockAnalysis = {
  runId: string;
  basedOnInputVersion: number;
  generatedAt: string;
  findings: Finding[];
  unreadEvidence: UnreadEvidence[];
  referral: Referral | null;
};

export type MockCase = {
  token: string;
  detail: CaseDetail;
  evidence: Evidence[];
  checkedItemIds: string[];
  runs: MockRun[];
  analysis: MockAnalysis | null;
  draft: Draft | null;
};

const dbStorageKey = "proofy.mockDb";

function loadCases(): Record<string, MockCase> {
  try {
    return JSON.parse(localStorage.getItem(dbStorageKey) ?? "{}");
  } catch {
    return {};
  }
}

function persistCases(cases: Record<string, MockCase>) {
  localStorage.setItem(dbStorageKey, JSON.stringify(cases));
}

export function findMockCase(caseId: string): MockCase | undefined {
  return loadCases()[caseId];
}

export function saveMockCase(caseId: string, mockCase: MockCase) {
  persistCases({ ...loadCases(), [caseId]: mockCase });
}

export function deleteMockCase(caseId: string) {
  const cases = loadCases();
  delete cases[caseId];
  persistCases(cases);
}

export function scenarioOf(detail: CaseDetail): SampleScenario {
  if (detail.sampleScenario) return detail.sampleScenario;
  return detail.inflow.type === "UNEXPECTED" ? "UNEXPECTED" : "GOODS";
}

export function buildChecklist(mockCase: MockCase): Checklist {
  const requirementItems = buildRequirementItems(mockCase.detail.inflow.type);

  const items: ChecklistItem[] = requirementItems.map((requirement) => {
    const satisfiedBy = mockCase.evidence
      .filter((evidence) =>
        requirement.acceptedDocTypes.includes(evidence.docType),
      )
      .map((evidence) => evidence.evidenceId);

    let status: ChecklistItem["status"] =
      satisfiedBy.length > 0 ? "SATISFIED" : "MISSING";
    if (!requirement.uploadable)
      status = requirement.code === "ID_COPY" ? "NOT_COLLECTED" : "GUIDE_ONLY";

    return {
      itemId: requirement.code,
      code: requirement.code,
      label: requirement.label,
      category: requirement.category,
      status,
      acceptedDocTypes: requirement.acceptedDocTypes,
      requiredForAnalysis: requirement.requiredForAnalysis,
      satisfiedBy,
      checked: mockCase.checkedItemIds.includes(requirement.code),
      note: requirement.note,
      sourceRef: requirement.sourceRef,
    };
  });

  if (mockCase.analysis && !mockCase.analysis.referral) {
    const isGoods = scenarioOf(mockCase.detail) === "GOODS";
    items.push({
      itemId: "ai-recommended-1",
      code: null,
      label: isGoods
        ? "택배 발송 기록(송장 번호 화면)"
        : "은행에 알린 기록(상담 내역, 접수 문자)",
      category: "AI_RECOMMENDED",
      status: "MISSING",
      acceptedDocTypes: isGoods ? ["SHIPPING"] : ["OTHER"],
      requiredForAnalysis: false,
      satisfiedBy: [],
      checked: mockCase.checkedItemIds.includes("ai-recommended-1"),
      note: "사연에는 있지만 이를 보여 주는 자료가 없습니다.",
      sourceRef: null,
    });
  }

  const missingCount = items.filter(
    (item) => item.status === "MISSING" && !item.checked,
  ).length;
  return { items, missingCount };
}

export function toCaseDetail(
  mockCase: MockCase,
  runStatusOf: (run: MockRun) => CaseDetail["latestRun"],
): CaseDetail {
  const latestMockRun = mockCase.runs[mockCase.runs.length - 1];
  const latestRun = latestMockRun ? runStatusOf(latestMockRun) : null;

  let status: CaseDetail["status"] = "DRAFT";
  if (latestRun?.status === "RUNNING") status = "ANALYZING";
  else if (mockCase.analysis) status = "REVIEW_READY";

  return {
    ...mockCase.detail,
    status,
    deadline: computeDeadline(mockCase.detail.publicNoticeDate),
    evidenceCount: mockCase.evidence.length,
    latestRun,
    hasResult: mockCase.analysis !== null,
  };
}

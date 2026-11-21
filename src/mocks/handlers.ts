import { http, HttpResponse } from "msw";
import {
  buildChecklist,
  deleteMockCase,
  findMockCase,
  saveMockCase,
  toCaseDetail,
  type MockCase,
} from "@/mocks/db";
import { computeDeadline, todayInKorea } from "@/mocks/dates";
import { errorResponse, forcedErrorFor } from "@/mocks/errors";
import { buildRequirementItems } from "@/mocks/requirements";
import {
  buildDraft,
  buildResult,
  buildRunView,
  createRun,
  findReferral,
  settleLatestRun,
  summarizeRun,
} from "@/mocks/runs";
import {
  buildPlaceholderFile,
  buildSampleCaseSeed,
  sampleSets,
} from "@/mocks/samples";
import type {
  AnalysisStart,
  CaseInput,
  CaseUpdate,
  DocType,
  DraftSentence,
  DraftUpdate,
  Evidence,
  InflowType,
  SampleScenario,
} from "@/types/api";

const maxEvidenceCount = 8;
const maxFileBytes = 10 * 1024 * 1024;
const acceptedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
const inflowTypes: InflowType[] = ["SALARY", "GOODS", "UNEXPECTED", "OTHER"];

function describeCase(mockCase: MockCase) {
  return toCaseDetail(mockCase, summarizeRun);
}

function lookupCase(request: Request, caseId: string) {
  const mockCase = findMockCase(caseId);
  if (!mockCase) return { response: errorResponse("CASE_NOT_FOUND") };
  if (request.headers.get("X-Case-Token") !== mockCase.token) {
    return { response: errorResponse("CASE_TOKEN_INVALID") };
  }
  settleLatestRun(mockCase);
  return { mockCase };
}

function findInvalidFields(input: CaseUpdate) {
  const today = todayInKorea();
  const fields: Record<string, string> = {};
  const futureMessage = "오늘 이후 날짜는 입력할 수 없어요.";

  if (
    input.noticeReceivedDate !== undefined &&
    (!input.noticeReceivedDate || input.noticeReceivedDate > today)
  ) {
    fields.noticeReceivedDate = futureMessage;
  }
  if (input.publicNoticeDate && input.publicNoticeDate > today)
    fields.publicNoticeDate = futureMessage;
  if (input.inflow) {
    const { type, amountKrw, occurredAt } = input.inflow;
    if (!inflowTypes.includes(type))
      fields["inflow.type"] = "입금 유형을 선택해 주세요.";
    if (
      !Number.isInteger(amountKrw) ||
      amountKrw < 1 ||
      amountKrw > 10_000_000_000
    ) {
      fields["inflow.amountKrw"] =
        "금액은 1원 이상 100억 원 이하로 입력해 주세요.";
    }
    if (occurredAt && occurredAt > today)
      fields["inflow.occurredAt"] = futureMessage;
  }
  if (input.narrative !== undefined && input.narrative.length > 2000) {
    fields.narrative = "사연은 2000자까지 쓸 수 있어요.";
  }
  return fields;
}

function createMockCase(
  input: CaseInput,
  sampleScenario: SampleScenario | null,
) {
  const caseId = crypto.randomUUID();
  const now = Date.now();
  const detail = {
    ...input,
    caseId,
    status: "DRAFT" as const,
    isSample: sampleScenario !== null,
    sampleScenario,
    narrative: null,
    inputVersion: 1,
    deadline: computeDeadline(input.publicNoticeDate),
    evidenceCount: 0,
    latestRun: null,
    hasResult: false,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
  };
  const mockCase: MockCase = {
    token: `pk_${crypto.randomUUID().replace(/-/g, "")}`,
    detail,
    evidence: [],
    checkedItemIds: [],
    runs: [],
    analysis: null,
    draft: null,
  };
  return { caseId, mockCase };
}

function createEvidence(
  docType: DocType,
  originalName: string,
  mimeType: string,
  sizeBytes: number,
  isSample: boolean,
): Evidence {
  return {
    evidenceId: crypto.randomUUID(),
    docType,
    originalName,
    mimeType,
    sizeBytes,
    extractStatus: "UPLOADED",
    lowConfidenceRegions: null,
    isSample,
    createdAt: new Date().toISOString(),
  };
}

function createdCaseResponse(caseId: string, mockCase: MockCase) {
  return HttpResponse.json(
    { caseId, caseToken: mockCase.token, case: describeCase(mockCase) },
    { status: 201 },
  );
}

function applyCaseUpdate(mockCase: MockCase, update: CaseUpdate) {
  const detail = mockCase.detail;
  let changed = false;
  const assign = <K extends keyof CaseUpdate>(key: K, value: CaseUpdate[K]) => {
    if (
      value === undefined ||
      JSON.stringify(detail[key as keyof typeof detail]) ===
        JSON.stringify(value)
    )
      return;
    (detail as unknown as Record<string, unknown>)[key] = value;
    changed = true;
  };
  assign("noticeReceivedDate", update.noticeReceivedDate);
  assign("publicNoticeDate", update.publicNoticeDate);
  assign("inflow", update.inflow);
  assign("hasPriorFreeze", update.hasPriorFreeze);
  assign("narrative", update.narrative);
  if (changed) detail.inputVersion += 1;
}

function hasTransactionRecord(mockCase: MockCase) {
  return mockCase.evidence.some(
    (evidence) => evidence.docType === "TRANSACTION_RECORD",
  );
}

function updateDraft(mockCase: MockCase, update: DraftUpdate) {
  const draft = mockCase.draft!;
  const sentences: DraftSentence[] = update.sentences.map((incoming) => {
    const existing = draft.sentences.find(
      (sentence) => sentence.sentenceId === incoming.sentenceId,
    );
    if (!existing) {
      return {
        sentenceId: crypto.randomUUID(),
        text: incoming.text,
        origin: "USER",
        section: null,
        findingIds: [],
        needsCheck: false,
        needsCheckReason: null,
        confirmed: incoming.confirmed ?? false,
        edited: false,
      };
    }
    const textChanged = existing.text !== incoming.text;
    return {
      ...existing,
      text: incoming.text,
      edited: existing.edited || textChanged,
      confirmed:
        incoming.confirmed ?? (textChanged ? false : existing.confirmed),
    };
  });
  mockCase.draft = buildDraft(draft.version + 1, draft.basedOnRunId, sentences);
}

export const handlers = [
  http.get("*/api/v1/health", () =>
    HttpResponse.json({
      status: "ok",
      agent: "scripted",
      demoMode: true,
      dailyUsage: { date: todayInKorea(), used: 12, limit: 300 },
    }),
  ),

  http.get("*/api/v1/meta/requirements", ({ request }) => {
    const inflowType = new URL(request.url).searchParams.get(
      "inflowType",
    ) as InflowType;
    return HttpResponse.json({
      inflowType,
      items: buildRequirementItems(inflowType),
    });
  }),

  http.get("*/api/v1/samples", () => HttpResponse.json({ items: sampleSets })),

  http.get("*/api/v1/samples/:scenario/:fileName", ({ params }) => {
    const { body, contentType } = buildPlaceholderFile(String(params.fileName));
    return new HttpResponse(body, { headers: { "Content-Type": contentType } });
  }),

  http.post("*/api/v1/cases", async ({ request }) => {
    const forced = forcedErrorFor([
      "VALIDATION_ERROR",
      "RATE_LIMITED",
      "INTERNAL",
    ]);
    if (forced) return forced;

    const input = (await request.json()) as CaseInput;
    const fields = findInvalidFields(input);
    if (Object.keys(fields).length > 0)
      return errorResponse("VALIDATION_ERROR", { fields });

    const { caseId, mockCase } = createMockCase(input, null);
    saveMockCase(caseId, mockCase);
    return createdCaseResponse(caseId, mockCase);
  }),

  http.post("*/api/v1/cases/sample", async ({ request }) => {
    const forced = forcedErrorFor(["RATE_LIMITED", "INTERNAL"]);
    if (forced) return forced;

    const { scenario } = (await request.json()) as { scenario: SampleScenario };
    const seed = buildSampleCaseSeed(scenario);
    const { caseId, mockCase } = createMockCase(seed.input, scenario);
    mockCase.detail.narrative = seed.narrative;
    mockCase.evidence = seed.evidence.map((item) =>
      createEvidence(
        item.docType,
        item.originalName,
        item.mimeType,
        item.sizeBytes,
        true,
      ),
    );
    saveMockCase(caseId, mockCase);
    return createdCaseResponse(caseId, mockCase);
  }),

  http.get("*/api/v1/cases/:caseId", ({ request, params }) => {
    const forced = forcedErrorFor([
      "CASE_TOKEN_INVALID",
      "CASE_NOT_FOUND",
      "INTERNAL",
    ]);
    if (forced) return forced;

    const found = lookupCase(request, String(params.caseId));
    if (found.response) return found.response;
    return HttpResponse.json({ case: describeCase(found.mockCase) });
  }),

  http.patch("*/api/v1/cases/:caseId", async ({ request, params }) => {
    const forced = forcedErrorFor([
      "VALIDATION_ERROR",
      "CASE_TOKEN_INVALID",
      "CASE_NOT_FOUND",
      "INTERNAL",
    ]);
    if (forced) return forced;

    const found = lookupCase(request, String(params.caseId));
    if (found.response) return found.response;

    const update = (await request.json()) as CaseUpdate;
    const fields = findInvalidFields(update);
    if (Object.keys(fields).length > 0)
      return errorResponse("VALIDATION_ERROR", { fields });

    applyCaseUpdate(found.mockCase, update);
    saveMockCase(String(params.caseId), found.mockCase);
    return HttpResponse.json({ case: describeCase(found.mockCase) });
  }),

  http.delete("*/api/v1/cases/:caseId", ({ request, params }) => {
    const found = lookupCase(request, String(params.caseId));
    if (found.response) return found.response;
    deleteMockCase(String(params.caseId));
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/api/v1/cases/:caseId/evidence", ({ request, params }) => {
    const found = lookupCase(request, String(params.caseId));
    if (found.response) return found.response;
    return HttpResponse.json({ items: found.mockCase.evidence });
  }),

  http.post("*/api/v1/cases/:caseId/evidence", async ({ request, params }) => {
    const forced = forcedErrorFor([
      "EVIDENCE_LIMIT",
      "FILE_TOO_LARGE",
      "UNSUPPORTED_FILE_TYPE",
      "INTERNAL",
    ]);
    if (forced) return forced;

    const found = lookupCase(request, String(params.caseId));
    if (found.response) return found.response;
    const { mockCase } = found;

    if (mockCase.evidence.length >= maxEvidenceCount)
      return errorResponse("EVIDENCE_LIMIT");
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const docType = formData.get("docType") as DocType;
    if (!acceptedMimeTypes.includes(file.type))
      return errorResponse("UNSUPPORTED_FILE_TYPE");
    if (file.size > maxFileBytes) return errorResponse("FILE_TOO_LARGE");

    const evidence = createEvidence(
      docType,
      file.name,
      file.type,
      file.size,
      false,
    );
    mockCase.evidence.push(evidence);
    mockCase.detail.inputVersion += 1;
    saveMockCase(String(params.caseId), mockCase);
    return HttpResponse.json({ evidence }, { status: 201 });
  }),

  http.delete(
    "*/api/v1/cases/:caseId/evidence/:evidenceId",
    ({ request, params }) => {
      const found = lookupCase(request, String(params.caseId));
      if (found.response) return found.response;
      const { mockCase } = found;

      const remaining = mockCase.evidence.filter(
        (evidence) => evidence.evidenceId !== params.evidenceId,
      );
      if (remaining.length === mockCase.evidence.length)
        return errorResponse("NOT_FOUND");
      mockCase.evidence = remaining;
      mockCase.detail.inputVersion += 1;
      saveMockCase(String(params.caseId), mockCase);
      return new HttpResponse(null, { status: 204 });
    },
  ),

  http.get("*/api/v1/cases/:caseId/checklist", ({ request, params }) => {
    const found = lookupCase(request, String(params.caseId));
    if (found.response) return found.response;
    return HttpResponse.json(buildChecklist(found.mockCase));
  }),

  http.patch(
    "*/api/v1/cases/:caseId/checklist/:itemId",
    async ({ request, params }) => {
      const found = lookupCase(request, String(params.caseId));
      if (found.response) return found.response;
      const { mockCase } = found;

      const { checked } = (await request.json()) as { checked: boolean };
      const itemId = String(params.itemId);
      mockCase.checkedItemIds = mockCase.checkedItemIds.filter(
        (checkedId) => checkedId !== itemId,
      );
      if (checked) mockCase.checkedItemIds.push(itemId);
      saveMockCase(String(params.caseId), mockCase);

      const item = buildChecklist(mockCase).items.find(
        (checklistItem) => checklistItem.itemId === itemId,
      );
      return item ? HttpResponse.json({ item }) : errorResponse("NOT_FOUND");
    },
  ),

  http.post(
    "*/api/v1/cases/:caseId/analysis-runs",
    async ({ request, params }) => {
      const forced = forcedErrorFor([
        "ANALYSIS_PRECONDITION",
        "RATE_LIMITED",
        "DAILY_LIMIT",
        "DRAFT_HAS_EDITS",
        "INTERNAL",
      ]);
      if (forced) return forced;

      const found = lookupCase(request, String(params.caseId));
      if (found.response) return found.response;
      const { mockCase } = found;

      const start = (await request.json()) as AnalysisStart;
      if (start.narrative !== undefined)
        applyCaseUpdate(mockCase, { narrative: start.narrative });

      const narrative = mockCase.detail.narrative ?? "";
      const missing: string[] = [];
      if (narrative.length < 20) missing.push("NARRATIVE");
      if (!hasTransactionRecord(mockCase)) missing.push("TRANSACTION_RECORD");
      if (missing.length > 0) {
        return errorResponse("ANALYSIS_PRECONDITION", {
          narrativeLength: narrative.length,
          missing,
        });
      }

      const latestRun = mockCase.runs[mockCase.runs.length - 1];
      if (latestRun && summarizeRun(latestRun).status === "RUNNING") {
        return errorResponse("ANALYSIS_IN_PROGRESS", {
          runId: latestRun.runId,
        });
      }
      const hasEditedDraft =
        mockCase.draft?.sentences.some((sentence) => sentence.edited) ?? false;
      if (hasEditedDraft && !start.overwriteEditedDraft)
        return errorResponse("DRAFT_HAS_EDITS");

      const run = createRun(mockCase, findReferral(narrative));
      saveMockCase(String(params.caseId), mockCase);
      return HttpResponse.json(
        { ...summarizeRun(run), status: "RUNNING" },
        { status: 202 },
      );
    },
  ),

  http.get(
    "*/api/v1/cases/:caseId/analysis-runs/:runId",
    ({ request, params }) => {
      const found = lookupCase(request, String(params.caseId));
      if (found.response) return found.response;
      const { mockCase } = found;

      const run = mockCase.runs.find(
        (candidate) => candidate.runId === params.runId,
      );
      if (!run) return errorResponse("NOT_FOUND");
      saveMockCase(String(params.caseId), mockCase);
      return HttpResponse.json(buildRunView(mockCase, run));
    },
  ),

  http.get("*/api/v1/cases/:caseId/result", ({ request, params }) => {
    const found = lookupCase(request, String(params.caseId));
    if (found.response) return found.response;

    const result = buildResult(found.mockCase);
    return result ? HttpResponse.json(result) : errorResponse("NOT_FOUND");
  }),

  http.get("*/api/v1/cases/:caseId/draft", ({ request, params }) => {
    const found = lookupCase(request, String(params.caseId));
    if (found.response) return found.response;
    return found.mockCase.draft
      ? HttpResponse.json({ draft: found.mockCase.draft })
      : errorResponse("NOT_FOUND");
  }),

  http.put("*/api/v1/cases/:caseId/draft", async ({ request, params }) => {
    const forced = forcedErrorFor(["VERSION_CONFLICT", "INTERNAL"]);
    if (forced) return forced;

    const found = lookupCase(request, String(params.caseId));
    if (found.response) return found.response;
    const { mockCase } = found;
    if (!mockCase.draft) return errorResponse("NOT_FOUND");

    const update = (await request.json()) as DraftUpdate;
    if (update.expectedVersion !== mockCase.draft.version) {
      return errorResponse("VERSION_CONFLICT", {
        currentVersion: mockCase.draft.version,
      });
    }
    updateDraft(mockCase, update);
    saveMockCase(String(params.caseId), mockCase);
    return HttpResponse.json({ draft: mockCase.draft });
  }),
];

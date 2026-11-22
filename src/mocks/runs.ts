import { buildScenarioAnalysis } from "@/mocks/analysisFixtures";
import { computeDeadline } from "@/mocks/dates";
import {
  buildChecklist,
  type MockCase,
  type MockRun,
  scenarioOf,
} from "@/mocks/db";
import type {
  AnalysisResult,
  AnalysisRun,
  AnalysisStep,
  Draft,
  DraftSentence,
  Referral,
  Stage,
  StageProgress,
} from "@/types/api";

const stepIntervalMs = 700;
const stageLabels: { key: Stage; label: string; durationMs: number }[] = [
  { key: "EXTRACTING", label: "글자 읽는 중", durationMs: 1500 },
  { key: "COMPARING", label: "거래내역과 대조 중", durationMs: 1500 },
  { key: "DRAFTING", label: "초안 작성 중", durationMs: 1500 },
];
const stageEndsMs = stageLabels.reduce<number[]>((ends, { durationMs }) => {
  ends.push((ends[ends.length - 1] ?? 0) + durationMs);
  return ends;
}, []);
const runDurationMs = stageEndsMs[stageEndsMs.length - 1];

const referralPatterns = [
  /통장을?\s*(빌려|대여|양도)/,
  /계좌를?\s*(빌려|대여|양도)/,
  /체크카드/,
  /비밀번호/,
  /환전/,
  /구매\s*대행/,
];

const aiNotice =
  "AI가 올린 자료를 정리한 결과입니다. 해제 여부를 판단하지 않으며, 은행 심사 결과와 다를 수 있습니다.";

function isFinished(run: MockRun) {
  if (run.referral) return true;
  return Date.now() - run.startedAt >= runDurationMs;
}

function currentStage(run: MockRun): Stage {
  if (isFinished(run)) return "FINISHED";
  const elapsed = Date.now() - run.startedAt;
  const stageIndex = stageEndsMs.findIndex((endMs) => elapsed < endMs);
  return stageLabels[stageIndex].key;
}

export function summarizeRun(run: MockRun) {
  return {
    runId: run.runId,
    status: isFinished(run) ? ("SUCCEEDED" as const) : ("RUNNING" as const),
    stage: currentStage(run),
  };
}

export function findReferral(narrative: string): Referral | null {
  const matchedPhrases = referralPatterns
    .map((pattern) => narrative.match(pattern)?.[0])
    .filter((phrase): phrase is string => phrase !== undefined);
  if (matchedPhrases.length === 0) return null;

  return {
    code: "LEGAL_CONSULT",
    matchedPhrases,
    message:
      "사연에 통장을 빌려주거나 남의 돈을 대신 보낸 것으로 보이는 표현이 있어 소명서 초안을 만들지 않았습니다. 이런 경우에는 이의제기 전에 법률 상담을 먼저 받으세요.",
    contacts: [
      { name: "대한법률구조공단", phone: "132" },
      { name: "금융감독원", phone: "1332" },
    ],
  };
}

export function createRun(
  mockCase: MockCase,
  referral: Referral | null,
): MockRun {
  const run: MockRun = {
    runId: crypto.randomUUID(),
    startedAt: Date.now(),
    inputVersionAtStart: mockCase.detail.inputVersion,
    referral,
  };
  mockCase.runs.push(run);
  return run;
}

export function buildDraft(
  version: number,
  basedOnRunId: string,
  sentences: DraftSentence[],
): Draft {
  let fullText = "";
  sentences.forEach((sentence, index) => {
    const previous = sentences[index - 1];
    const startsNewSection =
      previous &&
      sentence.section !== null &&
      sentence.section !== previous.section;
    if (index > 0) fullText += startsNewSection ? "\n\n" : " ";
    fullText += sentence.text;
  });

  return {
    version,
    basedOnRunId,
    sentences,
    warnings: [],
    unconfirmedCount: sentences.filter(
      (sentence) => sentence.needsCheck && !sentence.confirmed,
    ).length,
    fullText,
    updatedAt: new Date().toISOString(),
  };
}

export function settleLatestRun(mockCase: MockCase) {
  const run = mockCase.runs[mockCase.runs.length - 1];
  if (!run || !isFinished(run) || mockCase.analysis?.runId === run.runId)
    return;

  const generatedAt = new Date().toISOString();
  if (run.referral) {
    mockCase.analysis = {
      runId: run.runId,
      basedOnInputVersion: run.inputVersionAtStart,
      generatedAt,
      findings: [],
      unreadEvidence: [],
      referral: run.referral,
    };
    mockCase.draft = null;
    return;
  }

  const scenarioAnalysis = buildScenarioAnalysis(scenarioOf(mockCase.detail), {
    findEvidenceId: (docType) =>
      mockCase.evidence.find((evidence) => evidence.docType === docType)
        ?.evidenceId ?? "e-unknown",
  });
  mockCase.analysis = {
    runId: run.runId,
    basedOnInputVersion: run.inputVersionAtStart,
    generatedAt,
    findings: scenarioAnalysis.findings,
    unreadEvidence: scenarioAnalysis.unreadEvidence,
    referral: null,
  };
  mockCase.draft = buildDraft(
    (mockCase.draft?.version ?? 0) + 1,
    run.runId,
    scenarioAnalysis.sentences,
  );
}

function buildStages(run: MockRun): StageProgress[] {
  const elapsed = Date.now() - run.startedAt;
  return stageLabels.map(({ key, label }, index) => {
    let status: StageProgress["status"] = "PENDING";
    const startMs = index === 0 ? 0 : stageEndsMs[index - 1];
    if (elapsed >= stageEndsMs[index]) status = "DONE";
    else if (elapsed >= startMs) status = "RUNNING";
    return { key, label, status };
  });
}

function buildSteps(mockCase: MockCase, run: MockRun): AnalysisStep[] {
  if (run.referral) {
    return [
      {
        seq: 1,
        type: "SAFETY",
        title: "상담 안내",
        summary:
          "사연에 상담이 먼저 필요해 보이는 표현이 있어 초안을 만들지 않았습니다.",
        status: "DONE",
        at: new Date(run.startedAt).toISOString(),
      },
    ];
  }

  const elapsed = Date.now() - run.startedAt;
  const scenarioAnalysis = buildScenarioAnalysis(scenarioOf(mockCase.detail), {
    findEvidenceId: () => "",
  });
  return scenarioAnalysis.stepTitles
    .map((step, index) => ({
      ...step,
      seq: index + 1,
      at: new Date(run.startedAt + (index + 1) * stepIntervalMs).toISOString(),
    }))
    .filter((_, index) => elapsed >= (index + 1) * stepIntervalMs);
}

export function buildRunView(mockCase: MockCase, run: MockRun): AnalysisRun {
  const summary = summarizeRun(run);
  return {
    ...summary,
    stages: buildStages(run),
    steps: buildSteps(mockCase, run),
    error: null,
    startedAt: new Date(run.startedAt).toISOString(),
    finishedAt:
      summary.status === "RUNNING"
        ? null
        : new Date(run.startedAt + runDurationMs).toISOString(),
  };
}

export function buildResult(mockCase: MockCase): AnalysisResult | null {
  const analysis = mockCase.analysis;
  if (!analysis) return null;

  const checklist = buildChecklist(mockCase);
  const draft = mockCase.draft;
  const findingCounts = {
    MATCH: 0,
    CONFLICT: 0,
    STATEMENT_ONLY: 0,
    UNKNOWN: 0,
  };
  analysis.findings.forEach((finding) => (findingCounts[finding.status] += 1));

  return {
    runId: analysis.runId,
    basedOnInputVersion: analysis.basedOnInputVersion,
    isStale: analysis.basedOnInputVersion !== mockCase.detail.inputVersion,
    generatedAt: analysis.generatedAt,
    precomputed: false,
    referral: analysis.referral,
    aiNotice,
    deadline: computeDeadline(mockCase.detail.publicNoticeDate),
    findings: analysis.findings,
    checklist,
    draft,
    unreadEvidence: analysis.unreadEvidence,
    summary: {
      findingCounts,
      missingDocuments: analysis.referral ? 0 : checklist.missingCount,
      sentencesNeedingCheck: draft?.unconfirmedCount ?? 0,
      unreadEvidence: analysis.unreadEvidence.length,
    },
  };
}

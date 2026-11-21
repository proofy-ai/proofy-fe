export type InflowType = "SALARY" | "GOODS" | "UNEXPECTED" | "OTHER";

export type DocType =
  | "NOTICE"
  | "TRANSACTION_RECORD"
  | "INSURANCE_ELIGIBILITY"
  | "EMPLOYMENT_CERT"
  | "PAYSLIP"
  | "BUSINESS_REG"
  | "CHAT"
  | "CONTRACT"
  | "TAX_INVOICE"
  | "TRANSACTION_STATEMENT"
  | "SHIPPING"
  | "OTHER";

export type CaseStatus = "DRAFT" | "ANALYZING" | "REVIEW_READY" | "ERROR";
export type ExtractStatus = "UPLOADED" | "PROCESSING" | "READY" | "FAILED";
export type RunStatus = "RUNNING" | "SUCCEEDED" | "FAILED";
export type Stage = "EXTRACTING" | "COMPARING" | "DRAFTING" | "FINISHED";
export type StageStatus = "PENDING" | "RUNNING" | "DONE" | "FAILED";
export type FindingStatus = "MATCH" | "CONFLICT" | "STATEMENT_ONLY" | "UNKNOWN";
export type SourceKind = "EVIDENCE" | "TRANSACTION" | "NARRATIVE";
export type ChecklistCategory =
  | "OFFICIAL_REQUIRED"
  | "TYPE_GUIDE"
  | "ANALYSIS_INPUT"
  | "OPTIONAL"
  | "AI_RECOMMENDED";
export type ChecklistStatus =
  "SATISFIED" | "MISSING" | "NOT_COLLECTED" | "GUIDE_ONLY";
export type NeedsCheckReason =
  | "CONFLICT"
  | "NO_SOURCE"
  | "QUOTE_NOT_FOUND"
  | "NUMBER_MISMATCH"
  | "JUDGMENT_EXPRESSION"
  | "SOURCE_UNREAD";
export type DraftSection =
  "DEPOSIT_REASON" | "NO_INVOLVEMENT" | "VICTIM_CONTEXT";
export type DeadlineState = "UNKNOWN_NOTICE_DATE" | "OK" | "URGENT" | "EXPIRED";
export type SampleScenario = "GOODS" | "UNEXPECTED" | "SALARY";
export type StepType =
  | "OCR"
  | "TOOL_CALL"
  | "FINDING"
  | "CONFLICT"
  | "DRAFT"
  | "VERIFY"
  | "FALLBACK"
  | "SAFETY"
  | "FAILED";
export type ConflictField = "AMOUNT" | "DATE" | "COUNTERPARTY" | "OTHER";
export type AgentErrorCode = "AGENT_FAILED" | "AGENT_TIMEOUT" | "AGENT_REFUSED";

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | null;
  };
};

export type HealthStatus = {
  status: string;
  agent: "claude" | "scripted";
  demoMode: boolean;
  dailyUsage: { date: string; used: number; limit: number };
};

export type SourceReference = {
  label: string;
  url: string;
};

export type RequirementItem = {
  code: string;
  label: string;
  category: ChecklistCategory;
  acceptedDocTypes: DocType[];
  uploadable: boolean;
  requiredForAnalysis: boolean;
  note: string | null;
  sourceRef: SourceReference | null;
};

export type Requirements = {
  inflowType: InflowType;
  items: RequirementItem[];
};

export type Inflow = {
  type: InflowType;
  amountKrw: number;
  occurredAt: string | null;
};

export type CaseInput = {
  noticeReceivedDate: string;
  publicNoticeDate: string | null;
  inflow: Inflow;
  hasPriorFreeze: boolean | null;
};

export type CaseUpdate = Partial<CaseInput> & { narrative?: string };

export type Deadline = {
  state: DeadlineState;
  deadlineDate: string | null;
  daysLeft: number | null;
  label: string;
  basis: string;
  notice: string;
};

export type LatestRun = {
  runId: string;
  status: RunStatus;
  stage: Stage;
};

export type CaseDetail = {
  caseId: string;
  status: CaseStatus;
  isSample: boolean;
  sampleScenario: SampleScenario | null;
  narrative: string | null;
  inputVersion: number;
  deadline: Deadline;
  evidenceCount: number;
  latestRun: LatestRun | null;
  hasResult: boolean;
  createdAt: string;
  expiresAt: string;
} & CaseInput;

export type CaseResponse = {
  case: CaseDetail;
};

export type CreatedCaseResponse = {
  caseId: string;
  caseToken: string;
  case: CaseDetail;
};

export type SampleFile = {
  name: string;
  docType: DocType;
  url: string;
};

export type SampleSet = {
  scenario: SampleScenario;
  files: SampleFile[];
};

export type SamplesResponse = {
  items: SampleSet[];
};

export type Evidence = {
  evidenceId: string;
  docType: DocType;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  extractStatus: ExtractStatus;
  lowConfidenceRegions: unknown[] | null;
  isSample: boolean;
  createdAt: string;
};

export type ChecklistItem = {
  itemId: string;
  code: string | null;
  label: string;
  category: ChecklistCategory;
  status: ChecklistStatus;
  acceptedDocTypes: DocType[];
  requiredForAnalysis: boolean;
  satisfiedBy: string[];
  checked: boolean;
  note: string | null;
  sourceRef: SourceReference | null;
};

export type Checklist = {
  items: ChecklistItem[];
  missingCount: number;
};

export type AnalysisStart = {
  narrative?: string;
  overwriteEditedDraft?: boolean;
};

export type AnalysisStartResponse = {
  runId: string;
  status: RunStatus;
  stage: Stage;
};

export type StageProgress = {
  key: Stage;
  label: string;
  status: StageStatus;
};

export type AnalysisStep = {
  seq: number;
  type: StepType;
  title: string;
  summary: string;
  status: string;
  at: string;
};

export type AnalysisRun = {
  runId: string;
  status: RunStatus;
  stage: Stage;
  stages: StageProgress[];
  steps: AnalysisStep[];
  error: { code: AgentErrorCode; message: string } | null;
  startedAt: string;
  finishedAt: string | null;
};

export type FindingConflict = {
  field: ConflictField;
  statement: string;
  found: string;
};

export type NarrativeSource = {
  kind: "NARRATIVE";
  quote: string;
  verified: boolean;
};

export type EvidenceSource = {
  kind: "EVIDENCE";
  evidenceId: string;
  docType: DocType;
  originalName: string;
  page: number;
  regionIndex: number;
  quote: string;
  verified: boolean;
};

export type TransactionSource = {
  kind: "TRANSACTION";
  transactionId: string;
  evidenceId: string;
  occurredAt: string;
  direction: "IN" | "OUT";
  amountKrw: number;
  counterparty: string | null;
  verified: boolean;
};

export type FindingSource =
  NarrativeSource | EvidenceSource | TransactionSource;

export type Finding = {
  findingId: string;
  claim: string;
  status: FindingStatus;
  note: string;
  conflict: FindingConflict | null;
  sources: FindingSource[];
};

export type DraftSentence = {
  sentenceId: string;
  text: string;
  origin: "AI" | "USER";
  section: DraftSection | null;
  findingIds: string[];
  needsCheck: boolean;
  needsCheckReason: NeedsCheckReason | null;
  confirmed: boolean;
  edited: boolean;
};

export type DraftWarning = {
  code: string;
  findingId: string;
  message: string;
};

export type Draft = {
  version: number;
  basedOnRunId: string;
  sentences: DraftSentence[];
  warnings: DraftWarning[];
  unconfirmedCount: number;
  fullText: string;
  updatedAt: string;
};

export type DraftResponse = {
  draft: Draft;
};

export type DraftSentenceUpdate = {
  sentenceId: string | null;
  text: string;
  confirmed?: boolean;
};

export type DraftUpdate = {
  expectedVersion: number;
  sentences: DraftSentenceUpdate[];
};

export type Referral = {
  code: string;
  matchedPhrases: string[];
  message: string;
  contacts: { name: string; phone: string }[];
};

export type UnreadEvidence = {
  evidenceId: string;
  originalName: string;
  reason: string;
};

export type AnalysisSummary = {
  findingCounts: Record<FindingStatus, number>;
  missingDocuments: number;
  sentencesNeedingCheck: number;
  unreadEvidence: number;
};

export type AnalysisResult = {
  runId: string;
  basedOnInputVersion: number;
  isStale: boolean;
  generatedAt: string;
  precomputed: boolean;
  referral: Referral | null;
  aiNotice: string;
  deadline: Deadline;
  findings: Finding[];
  checklist: Checklist;
  draft: Draft | null;
  unreadEvidence: UnreadEvidence[];
  summary: AnalysisSummary;
};

export type StoredCase = {
  caseId: string;
  caseToken: string;
  createdAt: string;
  sampleScenario: SampleScenario | null;
};

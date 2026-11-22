import type {
  AnalysisStep,
  DocType,
  DraftSection,
  DraftSentence,
  Finding,
  SampleScenario,
  UnreadEvidence,
} from "@/types/api";

type EvidenceIds = {
  findEvidenceId: (docType: DocType) => string;
};

type ScenarioAnalysis = {
  findings: Finding[];
  sentences: DraftSentence[];
  unreadEvidence: UnreadEvidence[];
  stepTitles: Pick<AnalysisStep, "type" | "title" | "summary" | "status">[];
};

function aiSentence(
  sentenceId: string,
  section: DraftSection,
  text: string,
  findingIds: string[],
  needsCheckReason: DraftSentence["needsCheckReason"],
): DraftSentence {
  return {
    sentenceId,
    text,
    origin: "AI",
    section,
    findingIds,
    needsCheck: needsCheckReason !== null,
    needsCheckReason,
    confirmed: false,
    edited: false,
  };
}

function buildGoodsAnalysis({ findEvidenceId }: EvidenceIds): ScenarioAnalysis {
  return {
    findings: [
      {
        findingId: "f1",
        claim: "11월 8일 거래처에서 15만 원을 입금받았다",
        status: "MATCH",
        note: "거래내역서의 입금 행과 금액·날짜가 같습니다.",
        conflict: null,
        sources: [
          {
            kind: "NARRATIVE",
            quote: "11월 8일 대금을 계좌로 받았습니다",
            verified: true,
          },
          {
            kind: "TRANSACTION",
            transactionId: "t3",
            evidenceId: findEvidenceId("TRANSACTION_RECORD"),
            occurredAt: "2026-11-08",
            direction: "IN",
            amountKrw: 150000,
            counterparty: "김*수",
            verified: true,
          },
        ],
      },
      {
        findingId: "f2",
        claim: "가죽 지갑 3개를 15만 원에 납품하기로 했다",
        status: "CONFLICT",
        note: "대화내역의 합의 금액이 사연·입금액과 다릅니다.",
        conflict: {
          field: "AMOUNT",
          statement: "150,000원",
          found: "120,000원",
        },
        sources: [
          {
            kind: "EVIDENCE",
            evidenceId: findEvidenceId("CHAT"),
            docType: "CHAT",
            originalName: "대화내역_샘플.png",
            page: 1,
            regionIndex: 12,
            quote: "3개 12만원에 할게요",
            verified: true,
          },
        ],
      },
      {
        findingId: "f3",
        claim: "물건을 다음 날 택배로 보냈다",
        status: "STATEMENT_ONLY",
        note: "사연에만 있고 이를 보여 주는 자료가 없습니다.",
        conflict: null,
        sources: [
          {
            kind: "NARRATIVE",
            quote: "물건은 다음 날 택배로 보냈습니다",
            verified: true,
          },
        ],
      },
    ],
    sentences: [
      aiSentence(
        "s1",
        "DEPOSIT_REASON",
        "본인은 온라인 쇼핑몰을 운영하는 개인사업자로, 2026년 11월 8일 거래처에 가죽 지갑 3개를 납품하고 그 대금 150,000원을 입금받았습니다.",
        ["f1", "f2"],
        "CONFLICT",
      ),
      aiSentence(
        "s2",
        "DEPOSIT_REASON",
        "판매한 물건은 다음 날 택배로 발송하였습니다.",
        ["f3"],
        "NO_SOURCE",
      ),
    ],
    unreadEvidence: [],
    stepTitles: [
      {
        type: "OCR",
        title: "서류 글자 읽기",
        summary: "거래내역서, 대화내역 글자 읽기 완료",
        status: "DONE",
      },
      {
        type: "TOOL_CALL",
        title: "거래내역 조회",
        summary:
          "사연의 11월 8일 대금 입금을 확인하려고 11/1~11/10 입금을 조회 → 2건",
        status: "DONE",
      },
      {
        type: "FINDING",
        title: "자료와 일치",
        summary: "11월 8일 15만 원 입금이 거래내역서와 같습니다",
        status: "DONE",
      },
      {
        type: "CONFLICT",
        title: "자료와 어긋남",
        summary:
          "대화내역의 합의 금액(120,000원)이 사연·입금액(150,000원)과 다릅니다",
        status: "DONE",
      },
      {
        type: "DRAFT",
        title: "초안 작성",
        summary: "소명서 초안 문장 2개를 만들었습니다",
        status: "DONE",
      },
    ],
  };
}

function buildUnexpectedAnalysis({
  findEvidenceId,
}: EvidenceIds): ScenarioAnalysis {
  return {
    findings: [
      {
        findingId: "f1",
        claim: "모르는 사람에게서 10만 원이 입금되었다",
        status: "MATCH",
        note: "거래내역서에 같은 금액의 입금이 있습니다.",
        conflict: null,
        sources: [
          {
            kind: "NARRATIVE",
            quote: "모르는 사람이 10만 원을 보냈습니다",
            verified: true,
          },
          {
            kind: "TRANSACTION",
            transactionId: "t1",
            evidenceId: findEvidenceId("TRANSACTION_RECORD"),
            occurredAt: "2026-11-12",
            direction: "IN",
            amountKrw: 100000,
            counterparty: "이*호",
            verified: true,
          },
        ],
      },
      {
        findingId: "f2",
        claim: "입금일이 11월 11일이다",
        status: "CONFLICT",
        note: "사연의 입금 날짜와 거래내역 날짜가 다릅니다.",
        conflict: { field: "DATE", statement: "11월 11일", found: "11월 12일" },
        sources: [
          {
            kind: "TRANSACTION",
            transactionId: "t1",
            evidenceId: findEvidenceId("TRANSACTION_RECORD"),
            occurredAt: "2026-11-12",
            direction: "IN",
            amountKrw: 100000,
            counterparty: "이*호",
            verified: true,
          },
        ],
      },
      {
        findingId: "f3",
        claim: "입금 뒤 그 돈을 쓰지 않았다",
        status: "MATCH",
        note: "입금 뒤 같은 금액이 빠져나간 거래가 없습니다.",
        conflict: null,
        sources: [
          {
            kind: "EVIDENCE",
            evidenceId: findEvidenceId("CHAT"),
            docType: "CHAT",
            originalName: "협박문자_샘플.png",
            page: 1,
            regionIndex: 3,
            quote: "20만 원 보내면 신고 취하해 줄게",
            verified: true,
          },
        ],
      },
      {
        findingId: "f4",
        claim: "바로 은행에 알렸다",
        status: "STATEMENT_ONLY",
        note: "사연에만 있고 이를 보여 주는 자료가 없습니다.",
        conflict: null,
        sources: [
          {
            kind: "NARRATIVE",
            quote: "바로 은행에 알렸습니다",
            verified: true,
          },
        ],
      },
    ],
    sentences: [
      aiSentence(
        "s1",
        "DEPOSIT_REASON",
        "본인은 모르는 사람으로부터 2026년 11월 11일 100,000원을 입금받았고, 입금 뒤 그 돈을 사용하지 않았습니다.",
        ["f1", "f2", "f3"],
        "CONFLICT",
      ),
      aiSentence(
        "s2",
        "NO_INVOLVEMENT",
        "본인은 입금한 사람을 알지 못하며 이 거래에 관여한 사실이 없습니다.",
        [],
        "NO_SOURCE",
      ),
      aiSentence(
        "s3",
        "VICTIM_CONTEXT",
        "이후 입금자가 신고 취하를 대가로 금전을 요구하는 문자를 보냈습니다.",
        ["f3"],
        null,
      ),
    ],
    unreadEvidence: [],
    stepTitles: [
      {
        type: "OCR",
        title: "서류 글자 읽기",
        summary: "거래내역서, 협박 문자 글자 읽기 완료",
        status: "DONE",
      },
      {
        type: "TOOL_CALL",
        title: "거래내역 조회",
        summary: "입금 뒤 출금 여부를 확인하려고 11/9~11/20 출금을 조회 → 0건",
        status: "DONE",
      },
      {
        type: "FINDING",
        title: "자료와 일치",
        summary: "입금 금액이 거래내역서와 같습니다",
        status: "DONE",
      },
      {
        type: "CONFLICT",
        title: "자료와 어긋남",
        summary: "사연의 입금 날짜(11월 11일)가 거래내역(11월 12일)과 다릅니다",
        status: "DONE",
      },
      {
        type: "DRAFT",
        title: "초안 작성",
        summary: "소명서 초안 문장 3개를 만들었습니다",
        status: "DONE",
      },
    ],
  };
}

export function buildScenarioAnalysis(
  scenario: SampleScenario,
  evidenceIds: EvidenceIds,
) {
  if (scenario === "UNEXPECTED") return buildUnexpectedAnalysis(evidenceIds);
  return buildGoodsAnalysis(evidenceIds);
}

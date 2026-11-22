import { shiftDate, todayInKorea } from "@/mocks/dates";
import type {
  CaseInput,
  DocType,
  SampleScenario,
  SampleSet,
} from "@/types/api";

type SampleEvidence = {
  docType: DocType;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

type SampleCaseSeed = {
  input: CaseInput;
  narrative: string;
  evidence: SampleEvidence[];
};

export const sampleSets: SampleSet[] = [
  {
    scenario: "GOODS",
    files: [
      {
        name: "거래내역서_샘플.pdf",
        docType: "TRANSACTION_RECORD",
        url: "/api/v1/samples/goods/transaction_record.pdf",
      },
      {
        name: "대화내역_샘플.png",
        docType: "CHAT",
        url: "/api/v1/samples/goods/chat.png",
      },
    ],
  },
  {
    scenario: "UNEXPECTED",
    files: [
      {
        name: "거래내역서_샘플.pdf",
        docType: "TRANSACTION_RECORD",
        url: "/api/v1/samples/unexpected/transaction_record.pdf",
      },
      {
        name: "협박문자_샘플.png",
        docType: "CHAT",
        url: "/api/v1/samples/unexpected/threat.png",
      },
    ],
  },
];

export function buildSampleCaseSeed(scenario: SampleScenario): SampleCaseSeed {
  const today = todayInKorea();

  if (scenario === "UNEXPECTED") {
    return {
      input: {
        noticeReceivedDate: shiftDate(today, -8),
        publicNoticeDate: shiftDate(today, -4),
        inflow: {
          type: "UNEXPECTED",
          amountKrw: 100000,
          occurredAt: shiftDate(today, -13),
        },
        hasPriorFreeze: false,
      },
      narrative:
        "모르는 사람이 11월 11일 제 계좌로 10만 원을 보냈습니다. 며칠 뒤 계좌가 지급정지됐다는 통지를 받았고, 문자로 '20만 원 보내면 신고 취하해 줄게'라는 연락이 왔습니다. 저는 보낸 사람을 모르고, 받은 돈은 쓰지 않고 그대로 두었습니다. 바로 은행에 알렸습니다.",
      evidence: [
        {
          docType: "TRANSACTION_RECORD",
          originalName: "거래내역서_샘플.pdf",
          mimeType: "application/pdf",
          sizeBytes: 84210,
        },
        {
          docType: "CHAT",
          originalName: "협박문자_샘플.png",
          mimeType: "image/png",
          sizeBytes: 231044,
        },
      ],
    };
  }

  return {
    input: {
      noticeReceivedDate: shiftDate(today, -8),
      publicNoticeDate: shiftDate(today, -4),
      inflow: {
        type: "GOODS",
        amountKrw: 150000,
        occurredAt: shiftDate(today, -13),
      },
      hasPriorFreeze: false,
    },
    narrative:
      "온라인 쇼핑몰을 운영하는 개인사업자입니다. 거래처 소매점에 가죽 지갑 3개를 15만 원에 납품하기로 하고 11월 8일 대금을 계좌로 받았습니다. 물건은 다음 날 택배로 보냈습니다.",
    evidence: [
      {
        docType: "TRANSACTION_RECORD",
        originalName: "거래내역서_샘플.pdf",
        mimeType: "application/pdf",
        sizeBytes: 84210,
      },
      {
        docType: "CHAT",
        originalName: "대화내역_샘플.png",
        mimeType: "image/png",
        sizeBytes: 482113,
      },
      {
        docType: "BUSINESS_REG",
        originalName: "사업자등록증명_샘플.png",
        mimeType: "image/png",
        sizeBytes: 190377,
      },
    ],
  };
}

const placeholderPngBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const placeholderPdf =
  "%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 100]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF";

export function buildPlaceholderFile(fileName: string) {
  if (fileName.endsWith(".pdf")) {
    return { body: placeholderPdf, contentType: "application/pdf" };
  }
  return {
    body: Uint8Array.from(atob(placeholderPngBase64), (character) =>
      character.charCodeAt(0),
    ),
    contentType: "image/png",
  };
}

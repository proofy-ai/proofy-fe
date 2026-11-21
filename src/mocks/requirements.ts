import type { InflowType, RequirementItem } from "@/types/api";

const lawSource = {
  label: "통신사기피해환급법 시행령 제7조",
  url: "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=290281",
};
const articleSource = {
  label: "한국일보 2026.5.3",
  url: "https://www.hankookilbo.com/news/article/A2026050313580002729",
};

const commonItems: RequirementItem[] = [
  {
    code: "OBJECTION_FORM",
    label: "이의제기신청서(별지 제4호서식)",
    category: "OFFICIAL_REQUIRED",
    acceptedDocTypes: [],
    uploadable: false,
    requiredForAnalysis: false,
    note: "은행 창구·양식으로 작성합니다. 소명서 초안의 사유를 옮겨 적을 수 있습니다.",
    sourceRef: lawSource,
  },
  {
    code: "ID_COPY",
    label: "신분증 사본",
    category: "OFFICIAL_REQUIRED",
    acceptedDocTypes: [],
    uploadable: false,
    requiredForAnalysis: false,
    note: "이 서비스는 신분증을 받지 않습니다. 은행에 낼 때 직접 첨부하세요.",
    sourceRef: lawSource,
  },
  {
    code: "NOTICE",
    label: "지급정지 통지서",
    category: "OPTIONAL",
    acceptedDocTypes: ["NOTICE"],
    uploadable: true,
    requiredForAnalysis: false,
    note: "통지일·공고일을 확인하는 데 씁니다.",
    sourceRef: null,
  },
];

const typeItems: Record<InflowType, RequirementItem[]> = {
  SALARY: [
    {
      code: "SALARY_DEPOSIT",
      label: "급여 입금내역",
      category: "TYPE_GUIDE",
      acceptedDocTypes: ["TRANSACTION_RECORD"],
      uploadable: true,
      requiredForAnalysis: true,
      note: "문제된 입금이 보이는 거래내역서(은행 앱 캡처 또는 PDF)",
      sourceRef: articleSource,
    },
    {
      code: "EMPLOYMENT_PROOF",
      label: "건강보험자격득실확인서 또는 재직증명서 중 하나",
      category: "TYPE_GUIDE",
      acceptedDocTypes: ["INSURANCE_ELIGIBILITY", "EMPLOYMENT_CERT"],
      uploadable: true,
      requiredForAnalysis: false,
      note: null,
      sourceRef: articleSource,
    },
  ],
  GOODS: [
    {
      code: "BUSINESS_REG",
      label: "사업자등록",
      category: "TYPE_GUIDE",
      acceptedDocTypes: ["BUSINESS_REG"],
      uploadable: true,
      requiredForAnalysis: false,
      note: null,
      sourceRef: articleSource,
    },
    {
      code: "COUNTERPARTY_CHAT",
      label: "거래상대방과의 대화내역",
      category: "TYPE_GUIDE",
      acceptedDocTypes: ["CHAT"],
      uploadable: true,
      requiredForAnalysis: false,
      note: null,
      sourceRef: articleSource,
    },
    {
      code: "TRADE_DOCUMENT",
      label: "계약서, 세금계산서, 거래명세서 중 하나",
      category: "TYPE_GUIDE",
      acceptedDocTypes: ["CONTRACT", "TAX_INVOICE", "TRANSACTION_STATEMENT"],
      uploadable: true,
      requiredForAnalysis: false,
      note: "거래명세서가 있으면 대화 속 금액과 입금액이 다른 이유를 설명하는 데 도움이 됩니다.",
      sourceRef: articleSource,
    },
    {
      code: "DEPOSIT_RECORD",
      label: "문제된 입금이 보이는 거래내역서",
      category: "ANALYSIS_INPUT",
      acceptedDocTypes: ["TRANSACTION_RECORD"],
      uploadable: true,
      requiredForAnalysis: true,
      note: null,
      sourceRef: null,
    },
  ],
  UNEXPECTED: [
    {
      code: "THREAT_MESSAGE",
      label: "해제 대가를 요구하는 협박 문자·메시지",
      category: "TYPE_GUIDE",
      acceptedDocTypes: ["CHAT"],
      uploadable: true,
      requiredForAnalysis: false,
      note: "협박 문자가 없으면 이의제기가 받아들여지기 어렵다는 보도가 있습니다. 받은 메시지는 지우지 말고 캡처해 두세요.",
      sourceRef: {
        label: "금융위원회 보도참고 2024.2.1",
        url: "https://www.fsc.go.kr/no010101/81640",
      },
    },
    {
      code: "UNKNOWN_DEPOSIT_RECORD",
      label: "모르는 입금이 보이는 거래내역서",
      category: "ANALYSIS_INPUT",
      acceptedDocTypes: ["TRANSACTION_RECORD"],
      uploadable: true,
      requiredForAnalysis: true,
      note: null,
      sourceRef: null,
    },
    {
      code: "INCIDENT_REPORT",
      label: "경찰·은행에 신고한 기록(사건사고사실확인원, 신고 접수증 등)",
      category: "OPTIONAL",
      acceptedDocTypes: ["OTHER"],
      uploadable: true,
      requiredForAnalysis: false,
      note: "내가 피해를 입었다는 것을 보여 주는 기록입니다. 신고했다면 접수증이나 사건사고사실확인원을 받아 두세요.",
      sourceRef: null,
    },
  ],
  OTHER: [],
};

export function buildRequirementItems(
  inflowType: InflowType,
): RequirementItem[] {
  return [...commonItems.slice(0, 2), ...typeItems[inflowType], commonItems[2]];
}

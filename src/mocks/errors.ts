import { HttpResponse } from "msw";

interface MockErrorSpec {
  status: number;
  message: string;
  details?: Record<string, unknown>;
}

const forcedErrorStorageKey = "proofy.mockError";

const errorCatalog: Record<string, MockErrorSpec> = {
  VALIDATION_ERROR: {
    status: 400,
    message: "입력한 내용을 확인해 주세요.",
    details: {
      fields: { noticeReceivedDate: "오늘 이후 날짜는 입력할 수 없어요." },
    },
  },
  CASE_TOKEN_INVALID: { status: 401, message: "이 사건을 볼 권한이 없어요." },
  CASE_NOT_FOUND: {
    status: 404,
    message: "사건을 찾을 수 없어요. 이미 삭제되었거나 24시간이 지났어요.",
  },
  NOT_FOUND: { status: 404, message: "찾는 항목이 없어요." },
  EVIDENCE_LIMIT: {
    status: 409,
    message: "서류는 사건당 8개까지 올릴 수 있어요.",
  },
  ANALYSIS_IN_PROGRESS: { status: 409, message: "이미 분석 중이에요." },
  DRAFT_HAS_EDITS: {
    status: 409,
    message: "다시 분석하면 직접 고친 초안이 덮어써져요.",
  },
  VERSION_CONFLICT: {
    status: 409,
    message: "다른 곳에서 초안이 바뀌었어요. 최신 초안을 불러올게요.",
  },
  FILE_TOO_LARGE: {
    status: 413,
    message: "파일은 10MB 이하만 올릴 수 있어요.",
  },
  UNSUPPORTED_FILE_TYPE: {
    status: 415,
    message: "JPG, PNG, PDF 파일만 올릴 수 있어요.",
  },
  ANALYSIS_PRECONDITION: {
    status: 422,
    message: "사연을 20자 이상 입력하고 거래내역서를 올려 주세요.",
    details: {
      narrativeLength: 8,
      missing: ["NARRATIVE", "TRANSACTION_RECORD"],
    },
  },
  RATE_LIMITED: {
    status: 429,
    message: "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.",
  },
  DAILY_LIMIT: {
    status: 429,
    message: "오늘 시연 한도를 다 썼어요. 내일 다시 이용해 주세요.",
  },
  INTERNAL: {
    status: 500,
    message: "서버에 문제가 생겼어요. 다시 시도해 주세요.",
  },
};

export function errorResponse(code: string, details?: Record<string, unknown>) {
  const spec = errorCatalog[code];
  return HttpResponse.json(
    {
      error: {
        code,
        message: spec.message,
        details: details ?? spec.details ?? null,
      },
    },
    { status: spec.status },
  );
}

export function forcedErrorFor(allowedCodes: string[]) {
  const forcedCode = localStorage.getItem(forcedErrorStorageKey);
  if (forcedCode && allowedCodes.includes(forcedCode))
    return errorResponse(forcedCode);
}

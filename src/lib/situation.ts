import type { ApiError } from "@/api/client";
import type { CaseInput, InflowType } from "@/types/api";

const MAX_AMOUNT_KRW = 10_000_000_000;

export type PriorFreezeAnswer = "yes" | "no" | "unknown";

export type SituationValues = {
  noticeReceivedDate: string;
  publicNoticeDate: string;
  isPublicNoticeDateUnknown: boolean;
  inflowType: InflowType | "";
  amount: string;
  occurredAt: string;
  priorFreezeAnswer: PriorFreezeAnswer | "";
};

type SituationField =
  | "noticeReceivedDate"
  | "publicNoticeDate"
  | "inflowType"
  | "amount"
  | "occurredAt"
  | "priorFreezeAnswer";

export type SituationErrors = Partial<Record<SituationField, string>>;

export type SituationValueChange = <Key extends keyof SituationValues>(
  key: Key,
  value: SituationValues[Key],
) => void;

export const INITIAL_SITUATION_VALUES = {
  noticeReceivedDate: "",
  publicNoticeDate: "",
  isPublicNoticeDateUnknown: false,
  inflowType: "",
  amount: "",
  occurredAt: "",
  priorFreezeAnswer: "",
} satisfies SituationValues;

const FUTURE_DATE_MESSAGE = "오늘 이후 날짜는 입력할 수 없어요.";

const SERVER_FIELD_MAP = {
  noticeReceivedDate: "noticeReceivedDate",
  publicNoticeDate: "publicNoticeDate",
  "inflow.type": "inflowType",
  "inflow.amountKrw": "amount",
  "inflow.occurredAt": "occurredAt",
  hasPriorFreeze: "priorFreezeAnswer",
} satisfies Record<string, SituationField>;

const PRIOR_FREEZE_VALUES = {
  yes: true,
  no: false,
  unknown: null,
} satisfies Record<PriorFreezeAnswer, boolean | null>;

export const validateSituation = (
  values: SituationValues,
  today: string,
): SituationErrors => {
  const errors: SituationErrors = {};

  if (!values.noticeReceivedDate) {
    errors.noticeReceivedDate = "통지를 받은 날짜를 입력해 주세요.";
  } else if (values.noticeReceivedDate > today) {
    errors.noticeReceivedDate = FUTURE_DATE_MESSAGE;
  }

  if (!values.isPublicNoticeDateUnknown) {
    if (!values.publicNoticeDate) {
      errors.publicNoticeDate =
        "공고일을 입력하거나 '잘 모르겠어요'를 선택해 주세요.";
    } else if (values.publicNoticeDate > today) {
      errors.publicNoticeDate = FUTURE_DATE_MESSAGE;
    }
  }

  if (!values.inflowType) errors.inflowType = "입금 유형을 선택해 주세요.";

  const amount = Number(values.amount);
  if (!values.amount || amount < 1) {
    errors.amount = "입금액을 입력해 주세요.";
  } else if (amount > MAX_AMOUNT_KRW) {
    errors.amount = "입금액은 100억 원 이하로 입력해 주세요.";
  }

  if (values.occurredAt > today) errors.occurredAt = FUTURE_DATE_MESSAGE;

  if (!values.priorFreezeAnswer) {
    errors.priorFreezeAnswer =
      "이전에 지급정지를 받은 적이 있는지 선택해 주세요.";
  }

  return errors;
};

export const toCaseInput = (values: SituationValues): CaseInput | null => {
  const { inflowType, priorFreezeAnswer } = values;
  if (!inflowType || !priorFreezeAnswer) return null;

  return {
    noticeReceivedDate: values.noticeReceivedDate,
    publicNoticeDate: values.isPublicNoticeDateUnknown
      ? null
      : values.publicNoticeDate,
    inflow: {
      type: inflowType,
      amountKrw: Number(values.amount),
      occurredAt: values.occurredAt || null,
    },
    hasPriorFreeze: PRIOR_FREEZE_VALUES[priorFreezeAnswer],
  };
};

const isStringRecord = (value: unknown): value is Record<string, string> =>
  typeof value === "object" &&
  value !== null &&
  Object.values(value).every((item) => typeof item === "string");

const isServerField = (field: string): field is keyof typeof SERVER_FIELD_MAP =>
  field in SERVER_FIELD_MAP;

export const getServerFieldErrors = (error: ApiError): SituationErrors => {
  const fields = error.details?.fields;
  if (!isStringRecord(fields)) return {};

  const errors: SituationErrors = {};
  Object.entries(fields).forEach(([serverField, message]) => {
    if (isServerField(serverField)) {
      errors[SERVER_FIELD_MAP[serverField]] = message;
    }
  });
  return errors;
};

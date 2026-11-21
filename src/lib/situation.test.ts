import { describe, expect, it } from "vitest";

import { ApiError } from "@/api/client";
import {
  getServerFieldErrors,
  INITIAL_SITUATION_VALUES,
  type SituationValues,
  toCaseInput,
  validateSituation,
} from "@/lib/situation";

const TODAY = "2026-11-22";

const validValues = {
  noticeReceivedDate: "2026-11-10",
  publicNoticeDate: "2026-11-17",
  isPublicNoticeDateUnknown: false,
  inflowType: "GOODS",
  amount: "150000",
  occurredAt: "2026-11-08",
  priorFreezeAnswer: "no",
} satisfies SituationValues;

describe("validateSituation", () => {
  it("올바른 값이면 오류가 없다", () => {
    expect(validateSituation(validValues, TODAY)).toEqual({});
  });

  it("아무것도 입력하지 않으면 필수 항목마다 오류가 난다", () => {
    const errors = validateSituation(INITIAL_SITUATION_VALUES, TODAY);

    expect(Object.keys(errors).sort()).toEqual([
      "amount",
      "inflowType",
      "noticeReceivedDate",
      "priorFreezeAnswer",
      "publicNoticeDate",
    ]);
  });

  it("오늘 이후 날짜는 통지일, 공고일, 입금일 모두 막는다", () => {
    const errors = validateSituation(
      {
        ...validValues,
        noticeReceivedDate: "2026-11-23",
        publicNoticeDate: "2026-11-23",
        occurredAt: "2026-11-23",
      },
      TODAY,
    );

    expect(Object.keys(errors).sort()).toEqual([
      "noticeReceivedDate",
      "occurredAt",
      "publicNoticeDate",
    ]);
  });

  it("오늘 날짜는 허용하고 공고일이 통지일보다 앞서도 허용한다", () => {
    const errors = validateSituation(
      {
        ...validValues,
        noticeReceivedDate: TODAY,
        publicNoticeDate: "2026-11-01",
      },
      TODAY,
    );

    expect(errors).toEqual({});
  });

  it("공고일을 모른다고 하면 공고일을 검사하지 않는다", () => {
    const errors = validateSituation(
      { ...validValues, publicNoticeDate: "", isPublicNoticeDateUnknown: true },
      TODAY,
    );

    expect(errors).toEqual({});
  });

  it("입금일은 비워 둘 수 있다", () => {
    expect(
      validateSituation({ ...validValues, occurredAt: "" }, TODAY),
    ).toEqual({});
  });

  it("금액은 1원 이상 100억 원 이하만 허용한다", () => {
    expect(
      validateSituation({ ...validValues, amount: "0" }, TODAY).amount,
    ).toBeDefined();
    expect(
      validateSituation({ ...validValues, amount: "1" }, TODAY).amount,
    ).toBeUndefined();
    expect(
      validateSituation({ ...validValues, amount: "10000000000" }, TODAY)
        .amount,
    ).toBeUndefined();
    expect(
      validateSituation({ ...validValues, amount: "10000000001" }, TODAY)
        .amount,
    ).toBeDefined();
  });
});

describe("toCaseInput", () => {
  it("입력값을 요청 모양으로 바꾼다", () => {
    expect(toCaseInput(validValues)).toEqual({
      noticeReceivedDate: "2026-11-10",
      publicNoticeDate: "2026-11-17",
      inflow: { type: "GOODS", amountKrw: 150000, occurredAt: "2026-11-08" },
      hasPriorFreeze: false,
    });
  });

  it("공고일을 모르면 null로, 입금일이 없으면 null로 보낸다", () => {
    const input = toCaseInput({
      ...validValues,
      publicNoticeDate: "2026-11-17",
      isPublicNoticeDateUnknown: true,
      occurredAt: "",
      priorFreezeAnswer: "unknown",
    });

    expect(input?.publicNoticeDate).toBeNull();
    expect(input?.inflow.occurredAt).toBeNull();
    expect(input?.hasPriorFreeze).toBeNull();
  });

  it("예는 true로 바꾼다", () => {
    expect(
      toCaseInput({ ...validValues, priorFreezeAnswer: "yes" })?.hasPriorFreeze,
    ).toBe(true);
  });

  it("유형이나 과거 이력이 비어 있으면 만들지 않는다", () => {
    expect(toCaseInput({ ...validValues, inflowType: "" })).toBeNull();
    expect(toCaseInput({ ...validValues, priorFreezeAnswer: "" })).toBeNull();
  });
});

describe("getServerFieldErrors", () => {
  it("서버 필드 이름을 화면 칸 이름으로 바꾼다", () => {
    const error = new ApiError(400, "VALIDATION_ERROR", "오류", {
      fields: {
        noticeReceivedDate: "미래 날짜",
        "inflow.amountKrw": "금액 오류",
        "inflow.occurredAt": "입금일 오류",
      },
    });

    expect(getServerFieldErrors(error)).toEqual({
      noticeReceivedDate: "미래 날짜",
      amount: "금액 오류",
      occurredAt: "입금일 오류",
    });
  });

  it("모르는 필드나 이상한 모양은 무시한다", () => {
    expect(
      getServerFieldErrors(
        new ApiError(400, "VALIDATION_ERROR", "오류", {
          fields: { unknown: "x" },
        }),
      ),
    ).toEqual({});
    expect(
      getServerFieldErrors(
        new ApiError(400, "VALIDATION_ERROR", "오류", { fields: 5 }),
      ),
    ).toEqual({});
    expect(
      getServerFieldErrors(new ApiError(400, "VALIDATION_ERROR", "오류")),
    ).toEqual({});
  });
});

import { describe, expect, it } from "vitest";

import { getDefaultDocType, getUploadDocTypes } from "@/lib/uploadDocTypes";
import type { Checklist, ChecklistItem } from "@/types/api";

const itemOf = (overrides: Partial<ChecklistItem>): ChecklistItem => ({
  itemId: "i",
  code: "i",
  label: "항목",
  category: "TYPE_GUIDE",
  status: "MISSING",
  acceptedDocTypes: [],
  requiredForAnalysis: false,
  satisfiedBy: [],
  checked: false,
  note: null,
  sourceRef: null,
  ...overrides,
});

const checklistOf = (...items: ChecklistItem[]): Checklist => ({
  items,
  missingCount: 0,
});

describe("getUploadDocTypes", () => {
  it("올릴 수 있는 항목의 서류 종류를 중복 없이 모은다", () => {
    const checklist = checklistOf(
      itemOf({ acceptedDocTypes: ["CHAT"] }),
      itemOf({ acceptedDocTypes: ["CONTRACT", "TAX_INVOICE"] }),
      itemOf({ acceptedDocTypes: ["CHAT"] }),
    );

    expect(getUploadDocTypes(checklist)).toEqual([
      "CHAT",
      "CONTRACT",
      "TAX_INVOICE",
    ]);
  });

  it("직접 받지 않는 항목(신분증)과 서류 종류가 없는 항목은 뺀다", () => {
    const checklist = checklistOf(
      itemOf({ status: "NOT_COLLECTED", acceptedDocTypes: ["OTHER"] }),
      itemOf({ status: "GUIDE_ONLY", acceptedDocTypes: [] }),
    );

    expect(getUploadDocTypes(checklist)).toEqual([]);
  });

  it("체크리스트가 없으면 빈 목록이다", () => {
    expect(getUploadDocTypes(undefined)).toEqual([]);
  });
});

describe("getDefaultDocType", () => {
  it("분석에 필요한데 아직 없는 서류를 먼저 고른다", () => {
    const checklist = checklistOf(
      itemOf({ acceptedDocTypes: ["CHAT"] }),
      itemOf({
        acceptedDocTypes: ["TRANSACTION_RECORD"],
        requiredForAnalysis: true,
      }),
    );

    expect(getDefaultDocType(checklist)).toBe("TRANSACTION_RECORD");
  });

  it("필수 서류를 모두 올렸으면 아직 없는 첫 서류를 고른다", () => {
    const checklist = checklistOf(
      itemOf({ status: "SATISFIED", acceptedDocTypes: ["BUSINESS_REG"] }),
      itemOf({ acceptedDocTypes: ["CHAT"] }),
      itemOf({
        status: "SATISFIED",
        acceptedDocTypes: ["TRANSACTION_RECORD"],
        requiredForAnalysis: true,
      }),
    );

    expect(getDefaultDocType(checklist)).toBe("CHAT");
  });

  it("모두 올렸으면 첫 번째 올릴 수 있는 서류를 고른다", () => {
    const checklist = checklistOf(
      itemOf({ status: "SATISFIED", acceptedDocTypes: ["BUSINESS_REG"] }),
    );

    expect(getDefaultDocType(checklist)).toBe("BUSINESS_REG");
  });

  it("고를 서류가 없으면 null이다", () => {
    expect(getDefaultDocType(undefined)).toBeNull();
    expect(getDefaultDocType(checklistOf(itemOf({})))).toBeNull();
  });
});

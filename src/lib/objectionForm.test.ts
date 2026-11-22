import { describe, expect, it } from "vitest";

import {
  buildAttachmentLine,
  formatApplicationDate,
} from "@/lib/objectionForm";
import type { ChecklistItem, Evidence } from "@/types/api";

const createEvidence = (docType: Evidence["docType"], originalName: string) =>
  ({ docType, originalName }) as Evidence;

const createChecklistItem = (label: string, checked: boolean) =>
  ({ label, checked }) as ChecklistItem;

describe("buildAttachmentLine", () => {
  it("올린 서류 종류와 따로 준비한 항목을 중복 없이 이어 붙인다", () => {
    const line = buildAttachmentLine(
      [
        createEvidence("TRANSACTION_RECORD", "a.png"),
        createEvidence("TRANSACTION_RECORD", "b.png"),
        createEvidence("OTHER", "메모.pdf"),
      ],
      [
        createChecklistItem("사업자등록증명", true),
        createChecklistItem("계약서", false),
      ],
    );

    expect(line).toBe("첨부 자료: 거래내역서, 메모.pdf, 사업자등록증명.");
  });

  it("낼 서류가 없으면 빈 문자열을 돌려준다", () => {
    expect(buildAttachmentLine([], [])).toBe("");
  });
});

describe("formatApplicationDate", () => {
  it("날짜 문자열을 연, 월, 일 숫자로 나눈다", () => {
    expect(formatApplicationDate("2026-11-08")).toEqual({
      year: 2026,
      month: 11,
      day: 8,
    });
  });
});

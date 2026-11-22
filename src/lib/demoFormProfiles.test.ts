import { describe, expect, it } from "vitest";

import { createInitialFormFields } from "@/lib/demoFormProfiles";

describe("createInitialFormFields", () => {
  it("체험 계정은 미리 채워진 합성 신청인 정보로 시작한다", () => {
    const fields = createInitialFormFields("2026-11-22", "GOODS");

    expect(fields.applicantName).not.toBe("");
    expect(fields.accountNumber).not.toBe("");
    expect(fields.applicationDate).toBe("2026-11-22");
  });

  it("체험 계정마다 서로 다른 정보로 채운다", () => {
    expect(
      createInitialFormFields("2026-11-22", "GOODS").applicantName,
    ).not.toBe(
      createInitialFormFields("2026-11-22", "UNEXPECTED").applicantName,
    );
  });

  it("직접 해 보기는 신청일만 채우고 나머지는 비워 둔다", () => {
    const fields = createInitialFormFields("2026-11-22", null);

    expect(fields.applicantName).toBe("");
    expect(fields.applicationDate).toBe("2026-11-22");
  });
});

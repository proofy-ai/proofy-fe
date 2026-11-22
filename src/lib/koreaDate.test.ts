import { describe, expect, it } from "vitest";

import { formatCaseNumber } from "@/lib/koreaDate";

describe("formatCaseNumber", () => {
  it("한국 시간 기준 연월일-시분초 번호로 바꾼다", () => {
    expect(formatCaseNumber("2026-11-22T05:30:15Z")).toBe("261122-143015");
  });

  it("날짜가 넘어가는 시각도 한국 시간으로 계산한다", () => {
    expect(formatCaseNumber("2026-11-21T16:00:00Z")).toBe("261122-010000");
  });
});

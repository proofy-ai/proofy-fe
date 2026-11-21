import { describe, expect, it } from "vitest";

import { describeSource } from "@/lib/findingSources";

describe("describeSource", () => {
  it("사연 근거는 인용문을 보여 준다", () => {
    expect(
      describeSource({
        kind: "NARRATIVE",
        quote: "11월 8일에 받았다",
        verified: true,
      }),
    ).toEqual({ title: "내 사연", detail: "“11월 8일에 받았다”" });
  });

  it("서류 근거는 서류 이름과 쪽수를 제목으로 쓴다", () => {
    const description = describeSource({
      kind: "EVIDENCE",
      evidenceId: "e1",
      docType: "CHAT",
      originalName: "대화.png",
      page: 2,
      regionIndex: 0,
      quote: "12만 원으로 합의",
      verified: true,
    });

    expect(description.title).toBe("대화내역 2쪽");
    expect(description.detail).toBe("“12만 원으로 합의”");
  });

  it("거래 근거는 날짜, 입출금, 금액, 상대방을 보여 준다", () => {
    const description = describeSource({
      kind: "TRANSACTION",
      transactionId: "t1",
      evidenceId: "e1",
      occurredAt: "2026-11-08T15:03:00+09:00",
      direction: "IN",
      amountKrw: 150000,
      counterparty: "김OO",
      verified: true,
    });

    expect(description).toEqual({
      title: "거래내역 2026-11-08 입금",
      detail: "150,000원 · 김OO",
    });
  });

  it("상대방이 없으면 금액만 보여 준다", () => {
    const description = describeSource({
      kind: "TRANSACTION",
      transactionId: "t2",
      evidenceId: "e1",
      occurredAt: "2026-11-09",
      direction: "OUT",
      amountKrw: 3000,
      counterparty: null,
      verified: false,
    });

    expect(description.detail).toBe("3,000원");
  });
});

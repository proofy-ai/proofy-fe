import { describe, expect, it } from "vitest";

import { getNextTab, getResultTabFromState } from "@/lib/resultTabs";

describe("getResultTabFromState", () => {
  it("이동할 때 넘긴 탭 이름을 꺼낸다", () => {
    expect(getResultTabFromState({ tab: "DRAFT" })).toBe("DRAFT");
  });

  it("없거나 모르는 값이면 null이다", () => {
    expect(getResultTabFromState(null)).toBeNull();
    expect(getResultTabFromState({})).toBeNull();
    expect(getResultTabFromState({ tab: "OTHER" })).toBeNull();
  });
});

describe("getNextTab", () => {
  it("대응표, 부족한 서류, 소명서 초안, 신청서 완성 순서로 이어진다", () => {
    expect(getNextTab("FINDINGS")?.key).toBe("MISSING");
    expect(getNextTab("MISSING")?.key).toBe("DRAFT");
    expect(getNextTab("DRAFT")?.key).toBe("GUIDE");
  });

  it("마지막 탭 다음은 없다", () => {
    expect(getNextTab("GUIDE")).toBeNull();
  });
});

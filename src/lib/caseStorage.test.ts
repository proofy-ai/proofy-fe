import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  addStoredCase,
  filterCasesForSession,
  findLatestSampleCase,
  readStoredCases,
  removeStoredCase,
} from "@/lib/caseStorage";
import type { StoredCase } from "@/types/api";

function storedCase(caseId: string, caseToken = `token-${caseId}`): StoredCase {
  return { caseId, caseToken, createdAt: "", sampleScenario: null };
}

function stubLocalStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  });
  return store;
}

describe("caseStorage", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = stubLocalStorage();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("저장된 것이 없으면 빈 목록을 돌려준다", () => {
    expect(readStoredCases()).toEqual([]);
  });

  it("최신 사건이 맨 앞에 온다", () => {
    addStoredCase(storedCase("a"));
    addStoredCase(storedCase("b"));

    expect(readStoredCases().map((item) => item.caseId)).toEqual(["b", "a"]);
  });

  it("최대 10건만 남기고 가장 오래된 것부터 뺀다", () => {
    for (let index = 1; index <= 12; index++) {
      addStoredCase(storedCase(`c${index}`));
    }

    const caseIds = readStoredCases().map((item) => item.caseId);
    expect(caseIds).toHaveLength(10);
    expect(caseIds[0]).toBe("c12");
    expect(caseIds[9]).toBe("c3");
  });

  it("같은 사건을 다시 넣으면 중복 없이 맨 앞으로 옮기고 값을 갱신한다", () => {
    addStoredCase(storedCase("a"));
    addStoredCase(storedCase("b"));
    addStoredCase(storedCase("a", "새 토큰"));

    const cases = readStoredCases();
    expect(cases.map((item) => item.caseId)).toEqual(["a", "b"]);
    expect(cases[0].caseToken).toBe("새 토큰");
  });

  it("사건을 삭제한다", () => {
    addStoredCase(storedCase("a"));
    addStoredCase(storedCase("b"));

    removeStoredCase("a");

    expect(readStoredCases().map((item) => item.caseId)).toEqual(["b"]);
  });

  it("깨진 저장값은 빈 목록으로 본다", () => {
    store.set("proofy.cases", "{broken");

    expect(readStoredCases()).toEqual([]);
  });

  it("형식이 맞지 않는 항목은 걸러낸다", () => {
    store.set(
      "proofy.cases",
      JSON.stringify([{ caseId: "x" }, storedCase("ok"), 5, null]),
    );

    expect(readStoredCases().map((item) => item.caseId)).toEqual(["ok"]);
  });

  it("저장소를 쓸 수 없어도 오류 없이 빈 목록으로 동작한다", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    });

    expect(readStoredCases()).toEqual([]);
    expect(() => addStoredCase(storedCase("a"))).not.toThrow();
  });
});

describe("findLatestSampleCase", () => {
  it("같은 시나리오의 가장 최근 사건을 찾는다", () => {
    const cases: StoredCase[] = [
      { ...storedCase("new-goods"), sampleScenario: "GOODS" },
      { ...storedCase("unexpected"), sampleScenario: "UNEXPECTED" },
      { ...storedCase("old-goods"), sampleScenario: "GOODS" },
    ];

    expect(findLatestSampleCase(cases, "GOODS")?.caseId).toBe("new-goods");
    expect(findLatestSampleCase(cases, "SALARY")).toBeUndefined();
  });
});

describe("filterCasesForSession", () => {
  const cases: StoredCase[] = [
    { ...storedCase("goods"), sampleScenario: "GOODS" },
    { ...storedCase("unexpected"), sampleScenario: "UNEXPECTED" },
    storedCase("mine"),
  ];

  it("체험 계정에서는 그 계정의 사건만 보여 준다", () => {
    expect(
      filterCasesForSession(cases, "UNEXPECTED").map(({ caseId }) => caseId),
    ).toEqual(["unexpected"]);
  });

  it("직접 해 보기에서는 내가 만든 사건만 보여 준다", () => {
    expect(
      filterCasesForSession(cases, null).map(({ caseId }) => caseId),
    ).toEqual(["mine"]);
  });
});

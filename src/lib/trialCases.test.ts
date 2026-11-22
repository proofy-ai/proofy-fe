import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createSampleCase, deleteCase, getCase } from "@/api/cases";
import { ApiError } from "@/api/client";
import { addStoredCase, readStoredCases } from "@/lib/caseStorage";
import { ensureTrialCase } from "@/lib/trialCases";
import type { SampleScenario, StoredCase } from "@/types/api";

vi.mock("@/api/cases", () => ({
  createSampleCase: vi.fn(),
  deleteCase: vi.fn(),
  getCase: vi.fn(),
}));

function trialCase(caseId: string, scenario: SampleScenario | null) {
  return {
    caseId,
    caseToken: `token-${caseId}`,
    createdAt: "",
    sampleScenario: scenario,
  } satisfies StoredCase;
}

function storedCaseIds() {
  return readStoredCases().map(({ caseId }) => caseId);
}

describe("ensureTrialCase", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
    });
    vi.mocked(deleteCase).mockResolvedValue(undefined);
    vi.mocked(createSampleCase).mockResolvedValue({
      caseId: "created",
      caseToken: "token-created",
      case: { createdAt: "2026-11-22T00:00:00Z" },
    } as Awaited<ReturnType<typeof createSampleCase>>);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("살아 있는 사건이 있으면 새로 만들지 않고 그대로 쓴다", async () => {
    addStoredCase(trialCase("goods", "GOODS"));
    vi.mocked(getCase).mockResolvedValue(
      {} as Awaited<ReturnType<typeof getCase>>,
    );

    const caseId = await ensureTrialCase("GOODS");

    expect(caseId).toBe("goods");
    expect(createSampleCase).not.toHaveBeenCalled();
    expect(storedCaseIds()).toEqual(["goods"]);
  });

  it("사건이 없으면 새로 만든다", async () => {
    const caseId = await ensureTrialCase("GOODS");

    expect(caseId).toBe("created");
    expect(createSampleCase).toHaveBeenCalledWith("GOODS");
    expect(storedCaseIds()).toEqual(["created"]);
  });

  it("서버에서 사라진 사건은 버리고 새로 만든다", async () => {
    addStoredCase(trialCase("expired", "GOODS"));
    vi.mocked(getCase).mockRejectedValue(
      new ApiError(404, "CASE_NOT_FOUND", "없음"),
    );

    await ensureTrialCase("GOODS");

    expect(storedCaseIds()).toEqual(["created"]);
  });

  it("확인 중 서버 오류가 나면 기존 사건을 지키고 오류를 알린다", async () => {
    addStoredCase(trialCase("goods", "GOODS"));
    vi.mocked(getCase).mockRejectedValue(new ApiError(500, "INTERNAL", "오류"));

    await expect(ensureTrialCase("GOODS")).rejects.toThrow("오류");
    expect(storedCaseIds()).toEqual(["goods"]);
    expect(createSampleCase).not.toHaveBeenCalled();
  });

  it("쌓여 있던 같은 계정의 옛 사건은 정리하고 다른 사건은 지킨다", async () => {
    addStoredCase(trialCase("mine", null));
    addStoredCase(trialCase("other-account", "UNEXPECTED"));
    addStoredCase(trialCase("old-goods", "GOODS"));
    addStoredCase(trialCase("new-goods", "GOODS"));
    vi.mocked(getCase).mockResolvedValue(
      {} as Awaited<ReturnType<typeof getCase>>,
    );

    await ensureTrialCase("GOODS");

    expect(storedCaseIds()).toEqual(["new-goods", "other-account", "mine"]);
    expect(deleteCase).toHaveBeenCalledTimes(1);
    expect(deleteCase).toHaveBeenCalledWith("old-goods", "token-old-goods");
  });
});

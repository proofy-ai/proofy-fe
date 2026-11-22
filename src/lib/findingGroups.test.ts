import { describe, expect, it } from "vitest";

import {
  countFindingsByStatus,
  groupFindingsByAttention,
} from "@/lib/findingGroups";
import type { Finding, FindingStatus } from "@/types/api";

const createFinding = (findingId: string, status: FindingStatus): Finding => ({
  findingId,
  claim: "주장",
  status,
  note: "",
  conflict: null,
  sources: [],
});

const findings = [
  createFinding("a", "MATCH"),
  createFinding("b", "STATEMENT_ONLY"),
  createFinding("c", "CONFLICT"),
  createFinding("d", "MATCH"),
];

describe("groupFindingsByAttention", () => {
  it("확인이 필요한 항목을 어긋남부터 앞에 두고 일치 항목은 따로 모은다", () => {
    const { needsCheck, matched } = groupFindingsByAttention(findings);

    expect(needsCheck.map((finding) => finding.findingId)).toEqual(["c", "b"]);
    expect(matched.map((finding) => finding.findingId)).toEqual(["a", "d"]);
  });
});

describe("countFindingsByStatus", () => {
  it("개수가 있는 상태만 어긋남부터 순서대로 돌려준다", () => {
    expect(countFindingsByStatus(findings)).toEqual([
      { status: "CONFLICT", count: 1 },
      { status: "STATEMENT_ONLY", count: 1 },
      { status: "MATCH", count: 2 },
    ]);
  });
});

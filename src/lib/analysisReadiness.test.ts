import { describe, expect, it } from "vitest";

import { ApiError } from "@/api/client";
import {
  getAnalysisBlockers,
  getServerMissingItems,
} from "@/lib/analysisReadiness";
import type { Checklist, ChecklistItem } from "@/types/api";

const LONG_NARRATIVE =
  "온라인 쇼핑몰을 운영하는 개인사업자이고 대금을 받았습니다.";

const requiredItem = (status: ChecklistItem["status"]): ChecklistItem => ({
  itemId: "DEPOSIT_RECORD",
  code: "DEPOSIT_RECORD",
  label: "문제된 입금이 보이는 거래내역서",
  category: "ANALYSIS_INPUT",
  status,
  acceptedDocTypes: ["TRANSACTION_RECORD"],
  requiredForAnalysis: true,
  satisfiedBy: [],
  checked: false,
  note: null,
  sourceRef: null,
});

const checklistOf = (...items: ChecklistItem[]): Checklist => ({
  items,
  missingCount: 0,
});

describe("getAnalysisBlockers", () => {
  it("사연과 필수 서류가 모두 있으면 막는 이유가 없다", () => {
    expect(
      getAnalysisBlockers(
        LONG_NARRATIVE,
        checklistOf(requiredItem("SATISFIED")),
      ),
    ).toEqual([]);
  });

  it("사연이 20자 미만이면 현재 글자 수와 함께 알려 준다", () => {
    const blockers = getAnalysisBlockers(
      "짧은 사연",
      checklistOf(requiredItem("SATISFIED")),
    );

    expect(blockers).toEqual(["사연을 20자 이상 입력해 주세요. (지금 5자)"]);
  });

  it("앞뒤 공백은 글자 수에 세지 않는다", () => {
    const blockers = getAnalysisBlockers(`   ${"가".repeat(19)}   `, undefined);

    expect(blockers[0]).toContain("지금 19자");
  });

  it("분석에 필요한 서류가 없으면 그 서류 이름으로 알려 준다", () => {
    const blockers = getAnalysisBlockers(
      LONG_NARRATIVE,
      checklistOf(requiredItem("MISSING")),
    );

    expect(blockers).toEqual([
      "문제된 입금이 보이는 거래내역서를 올려 주세요.",
    ]);
  });

  it("분석에 필요하지 않은 서류는 막지 않는다", () => {
    const optionalItem = {
      ...requiredItem("MISSING"),
      requiredForAnalysis: false,
    };

    expect(
      getAnalysisBlockers(LONG_NARRATIVE, checklistOf(optionalItem)),
    ).toEqual([]);
  });

  it("체크리스트를 아직 못 불러왔으면 사연만 검사한다", () => {
    expect(getAnalysisBlockers(LONG_NARRATIVE, undefined)).toEqual([]);
    expect(getAnalysisBlockers("짧음", undefined)).toHaveLength(1);
  });
});

describe("getServerMissingItems", () => {
  it("서버가 알려 준 빠진 항목을 꺼낸다", () => {
    const error = new ApiError(422, "ANALYSIS_PRECONDITION", "오류", {
      missing: ["NARRATIVE", "TRANSACTION_RECORD"],
    });

    expect(getServerMissingItems(error)).toEqual([
      "NARRATIVE",
      "TRANSACTION_RECORD",
    ]);
  });

  it("없거나 모양이 다르면 빈 목록이다", () => {
    expect(getServerMissingItems(new ApiError(422, "X", "오류"))).toEqual([]);
    expect(
      getServerMissingItems(new ApiError(422, "X", "오류", { missing: 3 })),
    ).toEqual([]);
    expect(
      getServerMissingItems(new ApiError(422, "X", "오류", { missing: [1] })),
    ).toEqual([]);
  });
});

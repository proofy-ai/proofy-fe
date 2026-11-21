import { describe, expect, it } from "vitest";

import { ApiError } from "@/api/client";
import { isCaseGone } from "@/hooks/useMyCases";

describe("isCaseGone", () => {
  it("401과 404는 사라진 사건으로 본다", () => {
    expect(
      isCaseGone(new ApiError(401, "CASE_TOKEN_INVALID", "권한 없음")),
    ).toBe(true);
    expect(isCaseGone(new ApiError(404, "CASE_NOT_FOUND", "없음"))).toBe(true);
  });

  it("서버 오류나 네트워크 오류는 사라진 사건으로 보지 않는다", () => {
    expect(isCaseGone(new ApiError(500, "INTERNAL", "오류"))).toBe(false);
    expect(isCaseGone(new ApiError(0, "NETWORK", "끊김"))).toBe(false);
  });

  it("ApiError가 아니면 사라진 사건으로 보지 않는다", () => {
    expect(isCaseGone(new Error("x"))).toBe(false);
    expect(isCaseGone(undefined)).toBe(false);
  });
});

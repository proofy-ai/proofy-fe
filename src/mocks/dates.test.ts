import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { computeDeadline, shiftDate } from "@/mocks/dates";

describe("computeDeadline", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-21T03:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("공고일을 모르면 공고일 확인 필요로 본다", () => {
    const deadline = computeDeadline(null);

    expect(deadline.state).toBe("UNKNOWN_NOTICE_DATE");
    expect(deadline.deadlineDate).toBeNull();
    expect(deadline.daysLeft).toBeNull();
    expect(deadline.label).toBe("공고일 확인 필요");
  });

  it("공고일 다음 날부터 2개월 뒤 전날이 마지막 날이다(계약 예시 D-57)", () => {
    const deadline = computeDeadline("2026-11-17");

    expect(deadline.deadlineDate).toBe("2027-01-17");
    expect(deadline.daysLeft).toBe(57);
    expect(deadline.label).toBe("D-57");
    expect(deadline.state).toBe("OK");
  });

  it("같은 날짜가 없는 달은 그 달 말일이 마지막 날이다", () => {
    expect(computeDeadline("2026-11-30").deadlineDate).toBe("2027-01-31");
    expect(computeDeadline("2026-12-30").deadlineDate).toBe("2027-02-28");
  });

  it("8일 이상 남으면 OK, 7일 이하는 URGENT", () => {
    expect(computeDeadline("2026-09-29").daysLeft).toBe(8);
    expect(computeDeadline("2026-09-29").state).toBe("OK");
    expect(computeDeadline("2026-09-28").daysLeft).toBe(7);
    expect(computeDeadline("2026-09-28").state).toBe("URGENT");
  });

  it("마지막 날은 D-DAY, 지나면 기한 지남이다", () => {
    const lastDay = computeDeadline("2026-09-21");
    expect(lastDay.daysLeft).toBe(0);
    expect(lastDay.label).toBe("D-DAY");
    expect(lastDay.state).toBe("URGENT");

    const expired = computeDeadline("2026-09-20");
    expect(expired.daysLeft).toBe(-1);
    expect(expired.label).toBe("기한 지남");
    expect(expired.state).toBe("EXPIRED");
  });

  it("한국 날짜 기준으로 오늘을 센다(UTC 15시 이후는 다음 날)", () => {
    vi.setSystemTime(new Date("2026-11-20T16:00:00Z"));

    expect(computeDeadline("2026-11-17").daysLeft).toBe(57);
  });
});

describe("shiftDate", () => {
  it("달과 연을 넘겨서 날짜를 더하고 뺀다", () => {
    expect(shiftDate("2026-11-30", 1)).toBe("2026-12-01");
    expect(shiftDate("2027-01-01", -1)).toBe("2026-12-31");
  });
});

import type { Deadline } from "@/types/api";

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const bankConfirmNotice = "정확한 기한은 계좌가 있는 은행에 꼭 확인하세요.";

function toDateString(utcMilliseconds: number) {
  return new Date(utcMilliseconds).toISOString().slice(0, 10);
}

function parseDateString(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return { year, month, day };
}

export function todayInKorea() {
  return toDateString(Date.now() + 9 * 60 * 60 * 1000);
}

export function shiftDate(dateString: string, days: number) {
  const { year, month, day } = parseDateString(dateString);
  return toDateString(Date.UTC(year, month - 1, day + days));
}

function findLastDayOfDeadline(publicNoticeDate: string) {
  const { year, month, day } = parseDateString(shiftDate(publicNoticeDate, 1));
  const targetMonthIndex = month - 1 + 2;
  const lastDayOfTargetMonth = new Date(
    Date.UTC(year, targetMonthIndex + 1, 0),
  ).getUTCDate();
  if (day <= lastDayOfTargetMonth)
    return Date.UTC(year, targetMonthIndex, day - 1);
  return Date.UTC(year, targetMonthIndex, lastDayOfTargetMonth);
}

export function computeDeadline(publicNoticeDate: string | null): Deadline {
  if (!publicNoticeDate) {
    return {
      state: "UNKNOWN_NOTICE_DATE",
      deadlineDate: null,
      daysLeft: null,
      label: "공고일 확인 필요",
      basis: "공고일을 몰라 기한을 계산하지 못했습니다.",
      notice: bankConfirmNotice,
    };
  }

  const deadlineMilliseconds = findLastDayOfDeadline(publicNoticeDate);
  const today = parseDateString(todayInKorea());
  const todayMilliseconds = Date.UTC(today.year, today.month - 1, today.day);
  const daysLeft = Math.round(
    (deadlineMilliseconds - todayMilliseconds) / millisecondsPerDay,
  );

  let state: Deadline["state"] = "OK";
  if (daysLeft < 0) state = "EXPIRED";
  else if (daysLeft <= 7) state = "URGENT";

  let label = `D-${daysLeft}`;
  if (daysLeft === 0) label = "D-DAY";
  if (daysLeft < 0) label = "기한 지남";

  return {
    state,
    deadlineDate: toDateString(deadlineMilliseconds),
    daysLeft,
    label,
    basis: `공고일(${publicNoticeDate}) 기준 2개월, 참고 계산`,
    notice: bankConfirmNotice,
  };
}

const KOREA_OFFSET_MILLISECONDS = 9 * 60 * 60 * 1000;

export const getKoreaToday = () =>
  new Date(Date.now() + KOREA_OFFSET_MILLISECONDS).toISOString().slice(0, 10);

export const formatCaseNumber = (isoDateTime: string) => {
  const koreaTime = new Date(
    new Date(isoDateTime).getTime() + KOREA_OFFSET_MILLISECONDS,
  );
  const [date, time] = koreaTime
    .toISOString()
    .replace(/[-:]/g, "")
    .slice(2, 15)
    .split("T");
  return `${date}-${time}`;
};

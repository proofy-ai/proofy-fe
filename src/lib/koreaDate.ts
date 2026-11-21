const KOREA_OFFSET_MILLISECONDS = 9 * 60 * 60 * 1000;

export const getKoreaToday = () =>
  new Date(Date.now() + KOREA_OFFSET_MILLISECONDS).toISOString().slice(0, 10);

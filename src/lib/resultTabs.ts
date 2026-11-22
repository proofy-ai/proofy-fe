export type ResultTabKey = "FINDINGS" | "MISSING" | "DRAFT" | "GUIDE";

export const RESULT_TABS = [
  { key: "FINDINGS", label: "증빙 대응표", actionLabel: "증빙 대응표 보기" },
  { key: "MISSING", label: "부족한 서류", actionLabel: "부족한 서류 확인하기" },
  { key: "DRAFT", label: "소명서 초안", actionLabel: "소명서 초안 확인하기" },
  { key: "GUIDE", label: "신청서 완성", actionLabel: "신청서 완성하기" },
] satisfies { key: ResultTabKey; label: string; actionLabel: string }[];

const isResultTabKey = (value: unknown): value is ResultTabKey =>
  RESULT_TABS.some((tab) => tab.key === value);

export const getResultTabFromState = (state: unknown): ResultTabKey | null => {
  if (typeof state !== "object" || state === null) return null;
  if (!("tab" in state)) return null;
  return isResultTabKey(state.tab) ? state.tab : null;
};

export const getNextTab = (tab: ResultTabKey) => {
  const index = RESULT_TABS.findIndex((candidate) => candidate.key === tab);
  return RESULT_TABS[index + 1] ?? null;
};

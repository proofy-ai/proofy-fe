export type ResultTabKey = "FINDINGS" | "MISSING" | "DRAFT";

const TABS = [
  { key: "FINDINGS", label: "증빙 대응표" },
  { key: "MISSING", label: "부족한 서류" },
  { key: "DRAFT", label: "소명서 초안" },
] satisfies { key: ResultTabKey; label: string }[];

type Props = {
  activeTab: ResultTabKey;
  onTabChange: (tab: ResultTabKey) => void;
};

export function ResultTabs({ activeTab, onTabChange }: Props) {
  return (
    <div role="tablist" className="flex gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.key
              ? "bg-brand text-white"
              : "bg-white/70 text-ink hover:bg-brand-soft"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

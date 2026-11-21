import { RESULT_TABS, type ResultTabKey } from "@/lib/resultTabs";

type Props = {
  activeTab: ResultTabKey;
  onTabChange: (tab: ResultTabKey) => void;
};

export function ResultTabs({ activeTab, onTabChange }: Props) {
  return (
    <div role="tablist" className="flex gap-2">
      {RESULT_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 whitespace-nowrap rounded-full px-1 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
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

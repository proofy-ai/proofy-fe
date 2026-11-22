import { Check } from "lucide-react";

import { RESULT_TABS, type ResultTabKey } from "@/lib/resultTabs";

type Props = {
  activeTab: ResultTabKey;
  onTabChange: (tab: ResultTabKey) => void;
};

const CIRCLE_STYLES = {
  active:
    "bg-brand-strong text-white shadow-[0_4px_10px_rgb(var(--color-brand-strong)/0.35)]",
  passed: "bg-gray-600 text-white shadow-[0_3px_8px_rgb(0_0_0/0.25)]",
  upcoming: "bg-white text-ink-faint shadow-[0_2px_6px_rgb(0_0_0/0.1)]",
};

type CircleProps = {
  index: number;
  state: keyof typeof CIRCLE_STYLES;
};

function StepCircle({ index, state }: CircleProps) {
  return (
    <span
      key={state}
      style={{ animationDelay: `${index * 80}ms` }}
      className={`relative flex h-8 w-8 animate-step-slide-in items-center justify-center rounded-full text-sm font-bold motion-reduce:animate-none ${CIRCLE_STYLES[state]}`}
    >
      {state === "passed" ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        index + 1
      )}
    </span>
  );
}

export function ResultTabs({ activeTab, onTabChange }: Props) {
  const activeIndex = RESULT_TABS.findIndex((tab) => tab.key === activeTab);

  return (
    <div role="tablist" className="flex">
      {RESULT_TABS.map((tab, index) => {
        const isActive = index === activeIndex;
        const isPassed = index < activeIndex;
        const state = isActive ? "active" : isPassed ? "passed" : "upcoming";

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.key)}
            className="relative flex flex-1 flex-col items-center gap-1.5 px-1 transition-transform duration-300 ease-smooth active:scale-95"
          >
            {index < RESULT_TABS.length - 1 && (
              <span
                aria-hidden
                className="absolute left-1/2 top-[14.5px] h-[3px] w-full overflow-hidden bg-brand-line"
              >
                <span
                  className={`block h-full origin-left bg-brand-strong transition-transform duration-500 ease-smooth ${
                    isPassed ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </span>
            )}
            <StepCircle index={index} state={state} />
            <span
              className={`break-keep text-center text-sm transition-colors duration-300 ${
                isActive ? "font-semibold text-ink" : "text-ink-sub"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

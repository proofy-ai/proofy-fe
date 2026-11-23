import type { ReactNode } from "react";

import {
  AnalysisRequiredBadge,
  ChecklistStatusBadge,
} from "@/components/StatusBadge";
import {
  CHECKLIST_CATEGORY_ORDER,
  CHECKLIST_CATEGORY_TITLES,
} from "@/lib/docTypeLabels";
import type { Checklist, ChecklistItem } from "@/types/api";

type Props = {
  checklist: Checklist;
  renderAction?: (item: ChecklistItem) => ReactNode;
  isOnCard?: boolean;
};

type ItemProps = {
  item: ChecklistItem;
  action: ReactNode;
  isOnCard: boolean;
  categoryLabel?: string;
  className?: string;
};

export function ChecklistRow({
  item,
  action,
  isOnCard,
  categoryLabel,
  className = "",
}: ItemProps) {
  return (
    <li
      className={`flex flex-col gap-1.5 rounded-xl px-4 py-3 ${
        isOnCard ? "bg-gray-100" : "bg-white/70"
      } ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ChecklistStatusBadge
          status={item.status}
          isPreparedSeparately={item.checked}
        />
        {item.requiredForAnalysis && <AnalysisRequiredBadge />}
        {categoryLabel && (
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-ink-sub">
            {categoryLabel}
          </span>
        )}
      </div>
      <span className="break-keep font-medium text-ink">{item.label}</span>
      {item.note && (
        <p className="break-keep text-sm text-ink-sub">{item.note}</p>
      )}
      <div className="flex flex-wrap items-center gap-3">{action}</div>
    </li>
  );
}

export function ChecklistSection({
  checklist,
  renderAction,
  isOnCard = false,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-5">
      {CHECKLIST_CATEGORY_ORDER.map((category) => {
        const items = checklist.items.filter(
          (item) => item.category === category,
        );
        if (items.length === 0) return null;

        return (
          <section key={category} className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-ink">
              {CHECKLIST_CATEGORY_TITLES[category]}
            </h3>
            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <ChecklistRow
                  key={item.itemId}
                  item={item}
                  action={renderAction?.(item)}
                  isOnCard={isOnCard}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

import { ChevronDown } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChecklistRow } from "@/components/ChecklistSection";
import { Collapsible } from "@/components/common/Collapsible";
import { Toggle } from "@/components/common/Toggle";
import { useChecklistCheck } from "@/hooks/useChecklistCheck";
import { getEvidencePath } from "@/lib/casePaths";
import { CHECKLIST_CATEGORY_TITLES } from "@/lib/docTypeLabels";
import { groupChecklistByStatus } from "@/lib/missingDocumentGroups";
import type { Checklist, ChecklistItem } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  checklist: Checklist;
};

const LEAVING_DURATION_MILLISECONDS = 1000;

type GroupProps = {
  title?: string;
  items: ChecklistItem[];
  leavingItemIds?: Set<string>;
  enteringItemIds?: Set<string>;
  renderAction: (item: ChecklistItem) => ReactNode;
};

const getRowAnimationClassName = (
  itemId: string,
  leavingItemIds: Set<string>,
  enteringItemIds: Set<string>,
) => {
  if (leavingItemIds.has(itemId)) return "animate-row-leave overflow-hidden";
  if (enteringItemIds.has(itemId))
    return "animate-bubble-in motion-reduce:animate-none";
  return "";
};

function ItemGroup({
  title,
  items,
  leavingItemIds = new Set(),
  enteringItemIds = new Set(),
  renderAction,
}: GroupProps) {
  if (items.length === 0) return null;

  const stayingCount = items.filter(
    (item) => !leavingItemIds.has(item.itemId),
  ).length;

  return (
    <section className="flex flex-col gap-2">
      {title && (
        <h3 className="text-sm font-bold text-ink">
          {title} {stayingCount}
        </h3>
      )}
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <ChecklistRow
            key={item.itemId}
            item={item}
            isOnCard={false}
            categoryLabel={CHECKLIST_CATEGORY_TITLES[item.category]}
            className={getRowAnimationClassName(
              item.itemId,
              leavingItemIds,
              enteringItemIds,
            )}
            action={renderAction(item)}
          />
        ))}
      </ul>
    </section>
  );
}

export function MissingDocumentsTab({ caseId, caseToken, checklist }: Props) {
  const navigate = useNavigate();
  const [isPreparedOpen, setIsPreparedOpen] = useState(false);
  const { setChecked, pendingItemId } = useChecklistCheck(caseId, caseToken);
  const preparedSectionRef = useRef<HTMLDivElement>(null);
  const [leavingItems, setLeavingItems] = useState<ChecklistItem[]>([]);
  const [enteringItems, setEnteringItems] = useState<ChecklistItem[]>([]);
  const { toPrepare, toAttachByHand, prepared } = useMemo(
    () => groupChecklistByStatus(checklist.items),
    [checklist.items],
  );
  const previousToPrepareRef = useRef(toPrepare);

  useEffect(() => {
    const previousToPrepare = previousToPrepareRef.current;
    const justPrepared = previousToPrepare.filter(
      (previous) => !toPrepare.some((item) => item.itemId === previous.itemId),
    );
    const justReopened = toPrepare.filter(
      (item) =>
        !previousToPrepare.some((previous) => previous.itemId === item.itemId),
    );
    previousToPrepareRef.current = toPrepare;
    if (justPrepared.length === 0 && justReopened.length === 0) return;

    setLeavingItems(justPrepared);
    setEnteringItems(justReopened);
    if (justPrepared.length > 0) setIsPreparedOpen(true);
    const timerId = setTimeout(() => {
      setLeavingItems([]);
      setEnteringItems([]);
    }, LEAVING_DURATION_MILLISECONDS);
    return () => clearTimeout(timerId);
  }, [toPrepare]);

  useEffect(() => {
    if (leavingItems.length === 0) return;
    preparedSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [leavingItems]);

  const leavingItemIds = new Set(leavingItems.map((item) => item.itemId));
  const enteringItemIds = new Set(enteringItems.map((item) => item.itemId));
  const toPrepareWithLeaving = checklist.items.filter(
    (item) =>
      leavingItemIds.has(item.itemId) ||
      toPrepare.some((target) => target.itemId === item.itemId),
  );

  const renderPreparedToggle = (item: ChecklistItem) =>
    item.status === "MISSING" && (
      <div className="ml-auto flex items-center gap-2 text-sm text-ink">
        {pendingItemId === item.itemId ? "저장 중…" : "따로 준비했어요"}
        <Toggle
          size="sm"
          checked={item.checked}
          disabled={pendingItemId === item.itemId}
          aria-label={`${item.label} 따로 준비했어요`}
          onChange={(checked) => setChecked(item.itemId, checked)}
        />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <p className="break-keep text-sm text-ink-sub">
        {checklist.missingCount > 0
          ? `아직 준비하지 않은 서류가 ${checklist.missingCount}개 있어요.`
          : "빠진 서류가 없어요."}
      </p>
      <ItemGroup
        title="더 챙길 서류"
        items={toPrepareWithLeaving}
        leavingItemIds={leavingItemIds}
        enteringItemIds={enteringItemIds}
        renderAction={renderPreparedToggle}
      />
      <ItemGroup
        title="직접 준비할 서류"
        items={toAttachByHand}
        renderAction={renderPreparedToggle}
      />
      {prepared.length > 0 && (
        <div ref={preparedSectionRef} className="flex flex-col gap-2">
          <button
            type="button"
            aria-expanded={isPreparedOpen}
            onClick={() => setIsPreparedOpen((previous) => !previous)}
            className="flex items-center justify-between text-sm font-bold text-ink"
          >
            준비된 서류 {prepared.length}
            <ChevronDown
              aria-hidden
              className={`h-5 w-5 text-ink-sub transition-transform duration-300 ease-smooth ${
                isPreparedOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <Collapsible isOpen={isPreparedOpen}>
            <ItemGroup items={prepared} renderAction={renderPreparedToggle} />
          </Collapsible>
        </div>
      )}
      <button
        type="button"
        onClick={() => navigate(getEvidencePath(caseId))}
        className="self-center text-sm text-ink-sub underline"
      >
        부족한 서류를 더 추가해서 분석해 보세요
      </button>
    </div>
  );
}

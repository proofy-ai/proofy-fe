import type { ChecklistItem } from "@/types/api";

export type MissingDocumentGroups = {
  toPrepare: ChecklistItem[];
  toAttachByHand: ChecklistItem[];
  prepared: ChecklistItem[];
};

const isMissingAndNotPrepared = (item: ChecklistItem) =>
  item.status === "MISSING" && !item.checked;

const isHandAttached = (item: ChecklistItem) =>
  item.status === "NOT_COLLECTED" || item.status === "GUIDE_ONLY";

export const groupChecklistByStatus = (
  items: ChecklistItem[],
): MissingDocumentGroups => ({
  toPrepare: items.filter(isMissingAndNotPrepared),
  toAttachByHand: items.filter(isHandAttached),
  prepared: items.filter(
    (item) => !isMissingAndNotPrepared(item) && !isHandAttached(item),
  ),
});

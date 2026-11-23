import type { AnalysisStep } from "@/types/api";

export type TimelineStep = AnalysisStep & { isPlan: boolean };

const PLAN_STEP_TITLE = "조사 계획";
const PLAN_ITEMS_MARKER = /확인할 것 \d+가지:\s*/;
const PLAN_ITEM_SEPARATOR = " · ";
const REASON_SEPARATOR = " → ";
const LAW_SOURCE = "법령";
const ITEM_SOURCE_PATTERN = /^(.+?)\s*\(([^()]+)\)$/;

const describeSource = (source: string) =>
  source === LAW_SOURCE
    ? "관련 법령에서 근거를 찾을 계획이에요"
    : `${source}에서 조사할 계획이에요`;

const parsePlanItem = (text: string) => {
  const matched = ITEM_SOURCE_PATTERN.exec(text);
  return matched
    ? { label: matched[1], source: describeSource(matched[2]) }
    : { label: text, source: "" };
};

const splitPlanStep = (step: AnalysisStep): AnalysisStep[] => {
  const [beforeItems, itemsText] = step.summary.split(PLAN_ITEMS_MARKER);
  if (itemsText === undefined) return [step];

  const reason = beforeItems.replace(REASON_SEPARATOR, "").trim();
  const itemSteps = itemsText
    .split(PLAN_ITEM_SEPARATOR)
    .map((text) => text.trim())
    .filter((text) => text !== "")
    .map(parsePlanItem)
    .map(({ label, source }) => ({
      ...step,
      title: label,
      summary: source,
    }));
  return [{ ...step, summary: reason }, ...itemSteps];
};

export const expandPlanSteps = (steps: AnalysisStep[]): TimelineStep[] =>
  steps
    .flatMap((step) =>
      step.title === PLAN_STEP_TITLE
        ? splitPlanStep(step).map((planStep) => ({ ...planStep, isPlan: true }))
        : [{ ...step, isPlan: false }],
    )
    .map((step, index) => ({ ...step, seq: index + 1 }));

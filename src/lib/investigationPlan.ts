import type { AnalysisStep } from "@/types/api";

const PLAN_STEP_TITLE = "조사 계획";

export const isPlanStep = (step: AnalysisStep) =>
  step.title === PLAN_STEP_TITLE;

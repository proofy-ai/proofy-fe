import { motion, MotionConfig } from "framer-motion";
import {
  AlertTriangle,
  FileText,
  Info,
  ListChecks,
  type LucideIcon,
  PenLine,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { GlassCard } from "@/components/common/GlassCard";
import type { AnalysisStep, StepType } from "@/types/api";

type StepStyle = {
  Icon: LucideIcon;
  isAlert: boolean;
};

const STEP_STYLES = {
  OCR: { Icon: FileText, isAlert: false },
  TOOL_CALL: { Icon: Search, isAlert: false },
  FINDING: { Icon: ListChecks, isAlert: false },
  CONFLICT: { Icon: AlertTriangle, isAlert: true },
  DRAFT: { Icon: PenLine, isAlert: false },
  VERIFY: { Icon: ShieldCheck, isAlert: false },
  FALLBACK: { Icon: Info, isAlert: false },
  SAFETY: { Icon: Info, isAlert: false },
  FAILED: { Icon: XCircle, isAlert: true },
} satisfies Record<StepType, StepStyle>;

function getNodeClass(isAlert: boolean, isLatest: boolean) {
  if (isAlert) {
    return isLatest ? "bg-danger text-white" : "bg-danger-soft text-danger";
  }
  return isLatest
    ? "bg-brand-strong text-white ring-4 ring-brand-soft"
    : "bg-brand-soft text-brand-strong";
}

type ItemProps = {
  step: AnalysisStep;
  isLatest: boolean;
  isLast: boolean;
};

function StepTimelineItem({ step, isLatest, isLast }: ItemProps) {
  const { Icon, isAlert } = STEP_STYLES[step.type];
  const isEmphasized = isLatest || isAlert;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex gap-3"
    >
      <div className="flex flex-col items-center">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getNodeClass(isAlert, isLatest)}`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        {!isLast && <span className="my-1 w-px flex-1 bg-brand-line" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-5">
        <span
          className={`break-keep text-sm font-semibold ${isAlert ? "text-danger" : "text-ink"}`}
        >
          {step.title}
        </span>
        <span
          className={`break-keep text-xs text-ink-sub ${isEmphasized ? "" : "line-clamp-2"}`}
        >
          {step.summary}
        </span>
      </div>
    </motion.li>
  );
}

type Props = {
  steps: AnalysisStep[];
};

export function AnalysisStepFeed({ steps }: Props) {
  return (
    <GlassCard title="조사 기록">
      <MotionConfig reducedMotion="user">
        <ol className="flex w-full flex-col pt-1">
          {steps.map((step, index) => (
            <StepTimelineItem
              key={step.seq}
              step={step}
              isLatest={index === 0}
              isLast={index === steps.length - 1}
            />
          ))}
        </ol>
      </MotionConfig>
    </GlassCard>
  );
}

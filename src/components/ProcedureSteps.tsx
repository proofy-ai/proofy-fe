import { Link } from "react-router-dom";

import { StatusBadge } from "@/components/StatusBadge";
import { useInView } from "@/hooks/useInView";

const STEPS = [
  { label: "지급정지", isHelped: false },
  { label: "채권소멸절차 공고", isHelped: false },
  { label: "이의제기", note: "공고일 기준 2개월 이내", isHelped: true },
  { label: "심사", note: "원칙 5영업일", isHelped: false },
  { label: "결과", isHelped: false },
];
const STAGGER_MS = 320;

type StepProps = {
  index: number;
  label: string;
  note?: string;
  isHelped: boolean;
  isLast: boolean;
  isInView: boolean;
  baseDelayMs: number;
};

function StepNode({ index, isHelped }: { index: number; isHelped: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform duration-300 ease-smooth group-hover:scale-110 ${
        isHelped
          ? "bg-brand-strong text-white ring-4 ring-brand-soft"
          : "bg-brand-soft text-brand-strong"
      }`}
    >
      {index + 1}
    </span>
  );
}

function StepRow({
  index,
  label,
  note,
  isHelped,
  isLast,
  isInView,
  baseDelayMs,
}: StepProps) {
  const content = (
    <>
      <div className="flex flex-col items-center">
        <StepNode index={index} isHelped={isHelped} />
        {!isLast && (
          <span
            style={{
              transitionDelay: `${baseDelayMs + index * STAGGER_MS + 200}ms`,
            }}
            className={`my-1 w-0.5 flex-1 origin-top bg-brand-line transition-transform duration-500 ease-smooth ${
              isInView ? "scale-y-100" : "scale-y-0"
            }`}
          />
        )}
      </div>
      <div className="min-h-[3.75rem] min-w-0 flex-1 pb-5">
        <div className="-mx-3 -my-1.5 flex items-start justify-between gap-2 rounded-xl px-3 py-1.5 transition-colors duration-300 ease-smooth group-hover:bg-brand-soft/70">
          <span className="flex flex-col">
            <span
              className={`transition-colors duration-300 ${
                isHelped
                  ? "font-semibold text-ink group-hover:text-brand-strong"
                  : "text-ink"
              }`}
            >
              {label}
            </span>
            {note && (
              <span className="break-keep text-xs text-ink-sub">{note}</span>
            )}
          </span>
          {isHelped && <StatusBadge tone="info">Proofy가 도와요</StatusBadge>}
        </div>
      </div>
    </>
  );
  const rowClass = `flex gap-3 ${
    isInView ? "animate-step-slide-in motion-reduce:animate-none" : "opacity-0"
  }`;
  const delay = { animationDelay: `${baseDelayMs + index * STAGGER_MS}ms` };

  return isHelped ? (
    <Link to="/me" style={delay} className={`${rowClass} group`}>
      {content}
    </Link>
  ) : (
    <div style={delay} className={rowClass}>
      {content}
    </div>
  );
}

export function ProcedureSteps({ baseDelayMs = 0 }: { baseDelayMs?: number }) {
  const { ref, isInView } = useInView<HTMLOListElement>();

  return (
    <ol ref={ref} className="flex flex-col">
      {STEPS.map((step, index) => (
        <li key={step.label}>
          <StepRow
            index={index}
            isLast={index === STEPS.length - 1}
            isInView={isInView}
            baseDelayMs={baseDelayMs}
            {...step}
          />
        </li>
      ))}
    </ol>
  );
}

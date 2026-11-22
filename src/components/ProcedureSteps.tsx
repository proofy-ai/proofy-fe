import { Link } from "react-router-dom";

import { StatusBadge } from "@/components/StatusBadge";

const STEPS = [
  { label: "지급정지", isHelped: false },
  { label: "채권소멸절차 공고", isHelped: false },
  { label: "이의제기", note: "공고일 기준 2개월 이내", isHelped: true },
  { label: "심사", note: "원칙 5영업일", isHelped: false },
  { label: "결과", isHelped: false },
];

type StepProps = {
  index: number;
  label: string;
  note?: string;
  isHelped: boolean;
};

function StepContent({ index, label, note, isHelped }: StepProps) {
  return (
    <>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
          isHelped ? "bg-brand" : "bg-brand-light"
        }`}
      >
        {index + 1}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className={isHelped ? "font-semibold text-ink" : ""}>
          {label}
        </span>
        {note && (
          <span className="break-keep text-xs text-ink-sub">{note}</span>
        )}
      </span>
      {isHelped && (
        <span className="ml-auto shrink-0">
          <StatusBadge tone="info">Proofy가 도와요</StatusBadge>
        </span>
      )}
    </>
  );
}

export function ProcedureSteps() {
  return (
    <ol className="flex flex-col gap-1">
      {STEPS.map((step, index) => (
        <li key={step.label}>
          {step.isHelped ? (
            <Link
              to="/me"
              className="flex items-center gap-3 rounded-xl bg-brand-soft px-2 py-1.5 transition-colors duration-300 hover:bg-brand-pale"
            >
              <StepContent index={index} {...step} />
            </Link>
          ) : (
            <div className="flex items-center gap-3 rounded-xl px-2 py-1.5">
              <StepContent index={index} {...step} />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

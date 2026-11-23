import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { FindingSources } from "@/components/FindingSources";
import { FindingStatusBadge } from "@/components/StatusBadge";
import { getFindingElementId } from "@/hooks/useFindingFocus";
import { CONFLICT_FIELD_LABELS } from "@/lib/findingLabels";
import type { Finding, FindingConflict } from "@/types/api";

function ConflictComparison({ conflict }: { conflict: FindingConflict }) {
  return (
    <div className="grid items-stretch gap-2 text-sm sm:grid-cols-[1fr_auto_1fr]">
      <p className="break-keep rounded-xl bg-gray-100 p-3 text-ink">
        <span className="block text-xs text-ink-sub">
          내 진술({CONFLICT_FIELD_LABELS[conflict.field]})
        </span>
        {conflict.statement}
      </p>
      <span
        aria-hidden
        className="flex items-center justify-center text-lg font-bold text-danger"
      >
        ≠
      </span>
      <p className="break-keep rounded-xl bg-danger-soft p-3 text-ink">
        <span className="block text-xs text-ink-sub">자료에서 찾은 내용</span>
        {conflict.found}
      </p>
    </div>
  );
}

type Props = {
  finding: Finding;
};

export function FindingCard({ finding }: Props) {
  const [isOpen, setIsOpen] = useState(finding.status === "CONFLICT");

  return (
    <li
      id={getFindingElementId(finding.findingId)}
      className="scroll-mt-24 rounded-2xl bg-white/70"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <FindingStatusBadge status={finding.status} />
          <span className="break-keep font-semibold text-ink">
            {finding.claim}
          </span>
        </span>
        <ChevronDown
          aria-hidden
          className={`mt-1 h-5 w-5 shrink-0 text-ink-sub transition-transform duration-300 ease-smooth ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="flex animate-bubble-in flex-col gap-3 px-4 pb-4 motion-reduce:animate-none">
          <p className="break-keep text-sm text-ink-sub">{finding.note}</p>
          {finding.conflict && (
            <ConflictComparison conflict={finding.conflict} />
          )}
          <FindingSources sources={finding.sources} />
        </div>
      )}
    </li>
  );
}

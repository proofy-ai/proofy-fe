import { FindingSources } from "@/components/FindingSources";
import { FindingStatusBadge } from "@/components/StatusBadge";
import { CONFLICT_FIELD_LABELS } from "@/lib/findingLabels";
import type { Finding } from "@/types/api";

type Props = {
  finding: Finding;
};

export function FindingCard({ finding }: Props) {
  const { conflict } = finding;

  return (
    <li className="flex flex-col gap-2 rounded-2xl bg-white/70 p-4">
      <div>
        <FindingStatusBadge status={finding.status} />
      </div>
      <p className="break-keep font-semibold text-ink">{finding.claim}</p>
      <p className="break-keep text-sm text-ink-sub">{finding.note}</p>
      {conflict && (
        <div className="grid gap-2 rounded-xl bg-danger-soft p-3 text-sm sm:grid-cols-2">
          <p className="break-keep text-ink">
            <span className="block text-xs text-ink-sub">
              내 진술({CONFLICT_FIELD_LABELS[conflict.field]})
            </span>
            {conflict.statement}
          </p>
          <p className="break-keep text-ink">
            <span className="block text-xs text-ink-sub">
              자료에서 찾은 내용
            </span>
            {conflict.found}
          </p>
        </div>
      )}
      <FindingSources sources={finding.sources} />
    </li>
  );
}

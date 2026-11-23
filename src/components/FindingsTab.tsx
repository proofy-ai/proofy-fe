import { DeadlineBadge } from "@/components/DeadlineBadge";
import { FindingCard } from "@/components/FindingCard";
import { FindingStatusBadge } from "@/components/StatusBadge";
import { UnreadEvidenceList } from "@/components/UnreadEvidenceList";
import {
  countFindingsByStatus,
  groupFindingsByAttention,
} from "@/lib/findingGroups";
import type { AnalysisResult, Finding } from "@/types/api";

function FindingGroup({
  title,
  findings,
}: {
  title: string;
  findings: Finding[];
}) {
  if (findings.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-ink-sub">
        {title} <span className="text-brand-strong">{findings.length}</span>
      </h3>
      <ul className="flex flex-col gap-3">
        {findings.map((finding) => (
          <FindingCard key={finding.findingId} finding={finding} />
        ))}
      </ul>
    </section>
  );
}

type Props = {
  result: AnalysisResult;
};

export function FindingsTab({ result }: Props) {
  const { needsCheck, matched } = groupFindingsByAttention(result.findings);
  const statusCounts = countFindingsByStatus(result.findings);

  return (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          <DeadlineBadge deadline={result.deadline} />
        </li>
        {statusCounts.map(({ status, count }) => (
          <li key={status} className="flex items-center gap-1 text-sm">
            <FindingStatusBadge status={status} />
            <span className="font-semibold text-ink">{count}</span>
          </li>
        ))}
      </ul>
      <FindingGroup title="확인이 필요해요" findings={needsCheck} />
      <FindingGroup title="자료와 일치해요" findings={matched} />
      <UnreadEvidenceList items={result.unreadEvidence} />
      <p className="break-keep text-xs text-ink-faint">{result.aiNotice}</p>
    </div>
  );
}

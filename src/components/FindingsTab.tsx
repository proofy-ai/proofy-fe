import { FindingCard } from "@/components/FindingCard";
import { UnreadEvidenceList } from "@/components/UnreadEvidenceList";
import { FINDING_STATUS_LABELS } from "@/lib/findingLabels";
import type { AnalysisResult, FindingStatus } from "@/types/api";

const SUMMARY_ORDER = [
  "MATCH",
  "CONFLICT",
  "STATEMENT_ONLY",
  "UNKNOWN",
] satisfies FindingStatus[];

type Props = {
  result: AnalysisResult;
};

export function FindingsTab({ result }: Props) {
  const { findingCounts } = result.summary;

  return (
    <div className="flex flex-col gap-4">
      <p className="break-keep text-sm text-ink-sub">
        {SUMMARY_ORDER.filter((status) => findingCounts[status] > 0)
          .map(
            (status) =>
              `${FINDING_STATUS_LABELS[status]} ${findingCounts[status]}건`,
          )
          .join(" · ")}
      </p>
      <ul className="flex flex-col gap-3">
        {result.findings.map((finding) => (
          <FindingCard key={finding.findingId} finding={finding} />
        ))}
      </ul>
      <UnreadEvidenceList items={result.unreadEvidence} />
    </div>
  );
}

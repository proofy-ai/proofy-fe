import { FindingCard } from "@/components/FindingCard";
import { UnreadEvidenceList } from "@/components/UnreadEvidenceList";
import type { AnalysisResult } from "@/types/api";

type Props = {
  result: AnalysisResult;
};

export function FindingsTab({ result }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {result.findings.map((finding) => (
          <FindingCard key={finding.findingId} finding={finding} />
        ))}
      </ul>
      <UnreadEvidenceList items={result.unreadEvidence} />
      <p className="break-keep text-xs text-ink-faint">{result.aiNotice}</p>
    </div>
  );
}

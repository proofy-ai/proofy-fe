import { GlassCard } from "@/components/common/GlassCard";
import type { AnalysisSummary } from "@/types/api";

type Props = {
  summary: AnalysisSummary;
  unconfirmedCount: number;
};

export function GuideFinalCheck({ summary, unconfirmedCount }: Props) {
  const { findingCounts } = summary;
  const rows = [
    { label: "자료와 어긋난 내용", count: findingCounts.CONFLICT, unit: "건" },
    {
      label: "진술만 있고 근거가 없는 내용",
      count: findingCounts.STATEMENT_ONLY,
      unit: "건",
    },
    {
      label: "아직 준비하지 않은 서류",
      count: summary.missingDocuments,
      unit: "개",
    },
    { label: "직접 확인하지 않은 문장", count: unconfirmedCount, unit: "개" },
    { label: "AI가 읽지 못한 서류", count: summary.unreadEvidence, unit: "개" },
  ];

  return (
    <GlassCard title="제출 전 마지막 점검">
      <ul className="flex w-full flex-col gap-2">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between">
            <span className="break-keep text-ink">{row.label}</span>
            <span
              className={`font-bold ${row.count > 0 ? "text-warning" : "text-success"}`}
            >
              {row.count}
              {row.unit}
            </span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

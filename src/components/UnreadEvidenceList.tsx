import { StatusBadge } from "@/components/StatusBadge";
import type { UnreadEvidence } from "@/types/api";

type Props = {
  items: UnreadEvidence[];
};

export function UnreadEvidenceList({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-bold text-ink">AI가 읽지 못한 서류</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.evidenceId}
            className="flex flex-col gap-1 rounded-2xl bg-white/70 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-ink">{item.originalName}</span>
              <StatusBadge tone="warning">직접 확인</StatusBadge>
            </div>
            <p className="break-keep text-sm text-ink-sub">{item.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

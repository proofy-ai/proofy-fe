import { describeSource } from "@/lib/findingSources";
import type { FindingSource } from "@/types/api";

type Props = {
  sources: FindingSource[];
};

export function FindingSources({ sources }: Props) {
  if (sources.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1.5 border-t border-brand-line pt-3">
      {sources.map((source, index) => {
        const { title, detail } = describeSource(source);

        return (
          <li
            key={index}
            className={`flex flex-col text-sm ${source.verified ? "" : "opacity-60"}`}
          >
            <span className="font-medium text-ink">
              {title}
              {!source.verified && " (직접 확인 필요)"}
            </span>
            <span className="break-keep text-ink-sub">{detail}</span>
          </li>
        );
      })}
    </ul>
  );
}

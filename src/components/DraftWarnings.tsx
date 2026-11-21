import type { DraftWarning } from "@/types/api";

type Props = {
  warnings: DraftWarning[];
  onShowFinding: (findingId: string) => void;
};

export function DraftWarnings({ warnings, onShowFinding }: Props) {
  if (warnings.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {warnings.map((warning) => (
        <li
          key={`${warning.code}-${warning.findingId}`}
          className="flex flex-wrap items-center gap-2 rounded-xl bg-warning-soft px-4 py-3 text-sm text-ink"
        >
          <span className="break-keep">{warning.message}</span>
          <button
            type="button"
            onClick={() => onShowFinding(warning.findingId)}
            className="ml-auto underline"
          >
            근거 보기
          </button>
        </li>
      ))}
    </ul>
  );
}

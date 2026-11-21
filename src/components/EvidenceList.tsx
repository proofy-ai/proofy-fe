import { FileText, Trash2 } from "lucide-react";

import { DOC_TYPE_LABELS } from "@/lib/docTypeLabels";
import type { Evidence } from "@/types/api";

const DARK_MODE_IMAGE_FIX = "dark:[filter:invert(1)_hue-rotate(180deg)]";

type Props = {
  items: Evidence[];
  imageUrls: Record<string, string>;
  onDeleteClick: (evidenceId: string) => void;
};

export function EvidenceList({ items, imageUrls, onDeleteClick }: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((evidence) => {
        const imageUrl = imageUrls[evidence.evidenceId];

        return (
          <li
            key={evidence.evidenceId}
            className="flex items-center gap-3 rounded-xl bg-white/70 px-3 py-2"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={evidence.originalName}
                className={`h-12 w-12 shrink-0 rounded-lg object-cover ${DARK_MODE_IMAGE_FIX}`}
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface">
                <FileText className="h-5 w-5 text-ink-sub" aria-hidden />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {evidence.originalName}
              </p>
              <p className="text-xs text-ink-faint">
                {DOC_TYPE_LABELS[evidence.docType]}
                {evidence.isSample && " · 샘플"}
              </p>
            </div>
            <button
              type="button"
              aria-label={`${evidence.originalName} 삭제`}
              onClick={() => onDeleteClick(evidence.evidenceId)}
              className="rounded-full p-2 text-ink-sub transition-colors hover:bg-white/70 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

import { DOC_TYPE_LABELS } from "@/lib/docTypeLabels";
import type { ChecklistItem, DocType } from "@/types/api";

type Props = {
  item: ChecklistItem;
  onUploadClick: (docType: DocType) => void;
};

export function ChecklistUploadButton({ item, onUploadClick }: Props) {
  const [firstDocType] = item.acceptedDocTypes;
  if (item.status !== "MISSING" || !firstDocType) return null;

  return (
    <button
      type="button"
      onClick={() => onUploadClick(firstDocType)}
      className="ml-auto rounded-full border border-brand-line bg-white/70 px-2.5 py-0.5 text-xs font-medium text-ink transition-all duration-300 ease-smooth hover:scale-[1.04] hover:bg-brand-soft"
    >
      {DOC_TYPE_LABELS[firstDocType]} 올리기
    </button>
  );
}

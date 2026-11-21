import {
  AnalysisRequiredBadge,
  ChecklistStatusBadge,
} from "@/components/StatusBadge";
import {
  CHECKLIST_CATEGORY_ORDER,
  CHECKLIST_CATEGORY_TITLES,
  DOC_TYPE_LABELS,
} from "@/lib/docTypeLabels";
import type { Checklist, ChecklistItem, DocType } from "@/types/api";

type Props = {
  checklist: Checklist;
  onUploadClick: (docType: DocType) => void;
};

type ItemProps = {
  item: ChecklistItem;
  onUploadClick: (docType: DocType) => void;
};

function ChecklistRow({ item, onUploadClick }: ItemProps) {
  const [firstDocType] = item.acceptedDocTypes;
  const canUpload = item.status === "MISSING" && !!firstDocType;

  return (
    <li className="flex flex-col gap-1.5 rounded-xl bg-white/70 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <ChecklistStatusBadge status={item.status} />
        {item.requiredForAnalysis && <AnalysisRequiredBadge />}
      </div>
      <span className="break-keep font-medium text-ink">{item.label}</span>
      {item.note && (
        <p className="break-keep text-sm text-ink-sub">{item.note}</p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {item.sourceRef && (
          <a
            href={item.sourceRef.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-ink-faint underline"
          >
            근거: {item.sourceRef.label}
          </a>
        )}
        {canUpload && (
          <button
            type="button"
            onClick={() => onUploadClick(firstDocType)}
            className="ml-auto rounded-full border border-brand-line bg-white/70 px-3 py-1 text-xs font-medium text-ink transition-colors hover:bg-brand-soft"
          >
            {DOC_TYPE_LABELS[firstDocType]} 올리기
          </button>
        )}
      </div>
    </li>
  );
}

export function ChecklistSection({ checklist, onUploadClick }: Props) {
  return (
    <div className="flex w-full flex-col gap-5">
      {CHECKLIST_CATEGORY_ORDER.map((category) => {
        const items = checklist.items.filter(
          (item) => item.category === category,
        );
        if (items.length === 0) return null;

        return (
          <section key={category} className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-ink">
              {CHECKLIST_CATEGORY_TITLES[category]}
            </h3>
            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <ChecklistRow
                  key={item.itemId}
                  item={item}
                  onUploadClick={onUploadClick}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

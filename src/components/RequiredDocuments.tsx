import { FilePen, Files, IdCard, type LucideIcon } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { useInView } from "@/hooks/useInView";
import { SUBMISSION_DOCUMENTS } from "@/lib/guideContent";

const DOCUMENT_ICONS: Record<string, LucideIcon> = {
  이의제기신청서: FilePen,
  소명자료: Files,
  "신분증 사본": IdCard,
};
const STAGGER_MS = 110;

export function RequiredDocuments() {
  const { ref, isInView } = useInView<HTMLUListElement>();

  return (
    <ul ref={ref} className="flex w-full flex-col gap-3">
      {SUBMISSION_DOCUMENTS.map((document, index) => {
        const Icon = DOCUMENT_ICONS[document.title] ?? Files;
        const isSelfService = document.handledBy === "직접 첨부";

        return (
          <li
            key={document.title}
            style={{ animationDelay: `${index * STAGGER_MS}ms` }}
            className={`flex items-start gap-3 rounded-2xl bg-white/70 p-4 transition-transform duration-300 ease-smooth hover:scale-[1.02] ${
              isSelfService ? "border border-dashed border-brand-line" : ""
            } ${isInView ? "animate-bubble-in motion-reduce:animate-none" : "opacity-0"}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-ink">{document.title}</p>
                <StatusBadge tone={isSelfService ? "neutral" : "info"}>
                  {document.handledBy}
                </StatusBadge>
              </div>
              <p className="break-keep text-sm text-ink-sub">
                {document.description}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

import { FilePen, Files, IdCard, type LucideIcon } from "lucide-react";

import { SUBMISSION_DOCUMENTS } from "@/lib/guideContent";

const DOCUMENT_ICONS: Record<string, LucideIcon> = {
  이의제기신청서: FilePen,
  소명자료: Files,
  "신분증 사본": IdCard,
};

export function RequiredDocuments() {
  return (
    <ul className="flex w-full flex-col gap-4">
      {SUBMISSION_DOCUMENTS.map((document) => {
        const Icon = DOCUMENT_ICONS[document.title] ?? Files;

        return (
          <li key={document.title} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold">{document.title}</p>
              <p className="text-gray-600">{document.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

import { useRef } from "react";

import { GlassCard } from "@/components/common/GlassCard";
import { ObjectionDownloadButton } from "@/components/ObjectionDownloadButton";
import { ObjectionFormInputs } from "@/components/ObjectionFormInputs";
import { ObjectionFormPreview } from "@/components/ObjectionFormPreview";
import { ObjectionFormSheet } from "@/components/ObjectionFormSheet";
import { useObjectionFormFields } from "@/hooks/useObjectionFormFields";
import { useObjectionPdf } from "@/hooks/useObjectionPdf";
import { useObjectionReasonPages } from "@/hooks/useObjectionReasonPages";
import type { Checklist, Draft } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  draft: Draft;
  checklist: Checklist;
  onGoToDraft: () => void;
};

export function ObjectionFormPanel({
  caseId,
  caseToken,
  draft,
  checklist,
  onGoToDraft,
}: Props) {
  const exportRef = useRef<HTMLDivElement>(null);
  const { fields, setField } = useObjectionFormFields(caseId);
  const { isSaving, savePdf } = useObjectionPdf(exportRef);
  const { reasonPages, isReasonLoading } = useObjectionReasonPages(
    caseId,
    caseToken,
    draft,
    checklist,
  );

  return (
    <GlassCard title="이의제기신청서">
      <div className="flex w-full flex-col gap-5">
        <p className="break-keep text-sm text-ink-sub">
          입력한 내용은 이 화면에서만 쓰이고 서버로 보내지 않아요. 소명서 초안은
          위에서 고친 내용 그대로 들어가요.
        </p>
        <ObjectionFormInputs fields={fields} onChange={setField} />
        <ObjectionFormPreview fields={fields} reasonPages={reasonPages} />
        <ObjectionDownloadButton
          unconfirmedCount={draft.unconfirmedCount}
          isDisabled={isReasonLoading}
          isSaving={isSaving}
          onSave={savePdf}
          onGoToDraft={onGoToDraft}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed left-[-10000px] top-0"
      >
        <ObjectionFormSheet
          fields={fields}
          reasonPages={reasonPages}
          containerRef={exportRef}
        />
      </div>
    </GlassCard>
  );
}

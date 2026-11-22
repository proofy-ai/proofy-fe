import { useRef } from "react";

import { GlassCard } from "@/components/common/GlassCard";
import { FormInputsToggle } from "@/components/FormInputsToggle";
import { ObjectionDownloadButton } from "@/components/ObjectionDownloadButton";
import { ObjectionFormInputs } from "@/components/ObjectionFormInputs";
import { ObjectionFormPreview } from "@/components/ObjectionFormPreview";
import { ObjectionFormSheet } from "@/components/ObjectionFormSheet";
import { useObjectionFormFields } from "@/hooks/useObjectionFormFields";
import { useObjectionPdf } from "@/hooks/useObjectionPdf";
import { useObjectionReasonText } from "@/hooks/useObjectionReasonText";
import { useSessionStore } from "@/store/sessionStore";
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
  const isTrialAccount = useSessionStore(
    (state) => state.trialScenario !== null,
  );
  const { fields, setField } = useObjectionFormFields(caseId);
  const { isSaving, savePdf } = useObjectionPdf(exportRef, caseId);
  const { reasonText, isReasonLoading } = useObjectionReasonText(
    caseId,
    caseToken,
    draft,
    checklist,
  );

  return (
    <GlassCard title="이의제기신청서">
      <div className="flex w-full flex-col gap-5">
        <p className="break-keep text-sm text-ink-sub">
          아래 개인정보 내용은 저장하지 않아요.
        </p>
        {isTrialAccount ? (
          <FormInputsToggle title="신청인 정보를 적어주세요">
            <ObjectionFormInputs fields={fields} onChange={setField} />
          </FormInputsToggle>
        ) : (
          <ObjectionFormInputs fields={fields} onChange={setField} />
        )}
        <ObjectionFormPreview fields={fields} reasonText={reasonText} />
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
          reasonText={reasonText}
          containerRef={exportRef}
        />
      </div>
    </GlassCard>
  );
}

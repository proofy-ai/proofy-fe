import { DraftFullText } from "@/components/DraftFullText";
import { DraftOtherSentences } from "@/components/DraftOtherSentences";
import { DraftSentenceAdder } from "@/components/DraftSentenceAdder";
import { DraftSentenceCards } from "@/components/DraftSentenceCards";
import { DraftWarnings } from "@/components/DraftWarnings";
import { EmptyState } from "@/components/StateViews";
import { useDraftEditing } from "@/hooks/useDraftEditing";
import { toSentenceUpdates, withAppendedSentence } from "@/lib/draftEditing";
import type { Draft, Finding } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  draft: Draft | null;
  findings: Finding[];
  onShowFinding: (findingId: string) => void;
};

export function DraftTab({
  caseId,
  caseToken,
  draft,
  findings,
  onShowFinding,
}: Props) {
  const { save, isSaving } = useDraftEditing(
    caseId,
    caseToken,
    draft?.version ?? 0,
  );

  if (!draft) return <EmptyState title="아직 만든 초안이 없어요" />;

  const updates = toSentenceUpdates(draft.sentences);
  const adviceSentences = draft.sentences.filter(
    (sentence) => sentence.needsCheck,
  );
  const otherSentences = draft.sentences.filter(
    (sentence) => !sentence.needsCheck,
  );
  const cardProps = {
    allUpdates: updates,
    findings,
    isSaving,
    onSave: save,
    onShowFinding,
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="break-keep text-sm text-ink-sub">
        {draft.unconfirmedCount > 0
          ? `아직 직접 확인하지 않은 문장이 ${draft.unconfirmedCount}개 있어요.`
          : "확인할 문장을 모두 확인했어요."}
      </p>
      <DraftWarnings warnings={draft.warnings} onShowFinding={onShowFinding} />
      <DraftFullText sentences={draft.sentences} />
      {adviceSentences.length > 0 && (
        <h3 className="mt-2 text-sm font-bold text-ink">프루피 조언</h3>
      )}
      <DraftSentenceCards sentences={adviceSentences} {...cardProps} />
      {otherSentences.length > 0 && (
        <DraftOtherSentences sentences={otherSentences} {...cardProps} />
      )}
      <DraftSentenceAdder
        isSaving={isSaving}
        onAdd={(text) => save(withAppendedSentence(updates, text))}
      />
    </div>
  );
}

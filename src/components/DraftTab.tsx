import { DraftSentenceAdder } from "@/components/DraftSentenceAdder";
import { DraftSentenceItem } from "@/components/DraftSentenceItem";
import { DraftWarnings } from "@/components/DraftWarnings";
import { EmptyState } from "@/components/StateViews";
import { useDraftEditing } from "@/hooks/useDraftEditing";
import { getAdviceQuestions } from "@/lib/draftAdvice";
import {
  getSectionTitle,
  toSentenceUpdates,
  withAppendedSentence,
  withConfirmed,
  withEditedText,
  withoutSentence,
} from "@/lib/draftEditing";
import type { AgentQuestion, Draft } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  draft: Draft | null;
  questions: AgentQuestion[];
  onShowFinding: (findingId: string) => void;
};

export function DraftTab({
  caseId,
  caseToken,
  draft,
  questions,
  onShowFinding,
}: Props) {
  const { save, isSaving } = useDraftEditing(
    caseId,
    caseToken,
    draft?.version ?? 0,
  );

  if (!draft) return <EmptyState title="아직 만든 초안이 없어요" />;

  const updates = toSentenceUpdates(draft.sentences);

  return (
    <div className="flex flex-col gap-4">
      <p className="break-keep text-sm text-ink-sub">
        {draft.unconfirmedCount > 0
          ? `아직 직접 확인하지 않은 문장이 ${draft.unconfirmedCount}개 있어요.`
          : "확인할 문장을 모두 확인했어요."}
      </p>
      <DraftWarnings warnings={draft.warnings} onShowFinding={onShowFinding} />
      <ul className="flex flex-col gap-3">
        {draft.sentences.map((sentence, index) => (
          <div key={sentence.sentenceId} className="flex flex-col gap-2">
            {getSectionTitle(draft.sentences, index) && (
              <h3 className="mt-2 text-sm font-bold text-ink">
                {getSectionTitle(draft.sentences, index)}
              </h3>
            )}
            <DraftSentenceItem
              sentence={sentence}
              adviceQuestions={getAdviceQuestions(sentence, questions)}
              isSaving={isSaving}
              onTextSave={(id, text) => save(withEditedText(updates, id, text))}
              onConfirmChange={(id, confirmed) =>
                save(withConfirmed(updates, id, confirmed))
              }
              onDelete={(id) => save(withoutSentence(updates, id))}
              onShowFinding={onShowFinding}
            />
          </div>
        ))}
      </ul>
      <DraftSentenceAdder
        isSaving={isSaving}
        onAdd={(text) => save(withAppendedSentence(updates, text))}
      />
    </div>
  );
}

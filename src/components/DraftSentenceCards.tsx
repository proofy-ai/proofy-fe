import { DraftSentenceItem } from "@/components/DraftSentenceItem";
import {
  withConfirmed,
  withEditedText,
  withoutSentence,
} from "@/lib/draftEditing";
import type { DraftSentence, DraftSentenceUpdate, Finding } from "@/types/api";

type Props = {
  sentences: DraftSentence[];
  allUpdates: DraftSentenceUpdate[];
  findings: Finding[];
  isSaving: boolean;
  onSave: (updates: DraftSentenceUpdate[]) => void;
  onShowFinding: (findingId: string) => void;
};

export function DraftSentenceCards({
  sentences,
  allUpdates,
  findings,
  isSaving,
  onSave,
  onShowFinding,
}: Props) {
  return (
    <ul className="flex flex-col gap-3">
      {sentences.map((sentence) => (
        <DraftSentenceItem
          key={sentence.sentenceId}
          sentence={sentence}
          findings={findings}
          isSaving={isSaving}
          onTextSave={(id, text) =>
            onSave(withEditedText(allUpdates, id, text))
          }
          onConfirmChange={(id, confirmed) =>
            onSave(withConfirmed(allUpdates, id, confirmed))
          }
          onDelete={(id) => onSave(withoutSentence(allUpdates, id))}
          onShowFinding={onShowFinding}
        />
      ))}
    </ul>
  );
}

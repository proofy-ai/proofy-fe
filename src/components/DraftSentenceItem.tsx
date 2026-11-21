import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Toggle } from "@/components/common/Toggle";
import { ConfirmedBadge, NeedsCheckBadge } from "@/components/StatusBadge";
import { NEEDS_CHECK_REASON_LABELS } from "@/lib/draftLabels";
import type { DraftSentence } from "@/types/api";

type Props = {
  sentence: DraftSentence;
  isSaving: boolean;
  onTextSave: (sentenceId: string, text: string) => void;
  onConfirmChange: (sentenceId: string, confirmed: boolean) => void;
  onDelete: (sentenceId: string) => void;
  onShowFinding: (findingId: string) => void;
};

export function DraftSentenceItem({
  sentence,
  isSaving,
  onTextSave,
  onConfirmChange,
  onDelete,
  onShowFinding,
}: Props) {
  const [text, setText] = useState(sentence.text);
  const [firstFindingId] = sentence.findingIds;

  const handleTextBlur = () => {
    const trimmedText = text.trim();
    if (!trimmedText) return setText(sentence.text);
    if (trimmedText !== sentence.text)
      onTextSave(sentence.sentenceId, trimmedText);
  };

  return (
    <li className="flex flex-col gap-2 rounded-2xl bg-white/70 p-4">
      {sentence.needsCheck && (
        <div className="flex flex-wrap items-center gap-2">
          {sentence.confirmed ? <ConfirmedBadge /> : <NeedsCheckBadge />}
          {sentence.needsCheckReason && (
            <span className="text-xs text-ink-sub">
              {NEEDS_CHECK_REASON_LABELS[sentence.needsCheckReason]}
            </span>
          )}
        </div>
      )}
      <textarea
        aria-label="소명서 문장"
        rows={3}
        value={text}
        disabled={isSaving}
        onChange={(event) => setText(event.target.value)}
        onBlur={handleTextBlur}
        className={`w-full resize-y rounded-xl border bg-white/80 px-3 py-2 text-base text-ink ${
          sentence.needsCheck && !sentence.confirmed
            ? "border-warning"
            : "border-brand-line"
        }`}
      />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {firstFindingId && (
          <button
            type="button"
            onClick={() => onShowFinding(firstFindingId)}
            className="text-ink-sub underline"
          >
            근거 보기
          </button>
        )}
        {sentence.needsCheck && (
          <div className="flex items-center gap-2 text-ink">
            직접 확인했어요
            <Toggle
              size="sm"
              checked={sentence.confirmed}
              disabled={isSaving}
              aria-label="직접 확인했어요"
              onChange={(checked) =>
                onConfirmChange(sentence.sentenceId, checked)
              }
            />
          </div>
        )}
        <button
          type="button"
          aria-label="문장 삭제"
          disabled={isSaving}
          onClick={() => onDelete(sentence.sentenceId)}
          className="ml-auto rounded-full p-2 text-ink-sub transition-colors hover:text-danger"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}

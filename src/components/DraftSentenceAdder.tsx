import { useState } from "react";

import { Button } from "@/components/common/Button";

type Props = {
  isSaving: boolean;
  onAdd: (text: string) => void;
};

export function DraftSentenceAdder({ isSaving, onAdd }: Props) {
  const [text, setText] = useState("");

  const handleAddClick = () => {
    onAdd(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        aria-label="추가할 문장"
        rows={2}
        value={text}
        placeholder="소명을 위해 추가로 전달할 내용을 적을 수 있어요."
        onChange={(event) => setText(event.target.value)}
        className="w-full resize-y rounded-xl border border-brand-line bg-white/80 px-3 py-2 text-base text-ink placeholder:text-ink-mark"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={isSaving || !text.trim()}
          onClick={handleAddClick}
        >
          문장 추가
        </Button>
      </div>
    </div>
  );
}

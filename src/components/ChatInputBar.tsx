import { useState } from "react";

import { Button } from "@/components/common/Button";
import { MAX_ANSWER_LENGTH } from "@/lib/chatAnswers";

type Props = {
  defaultValue: string;
  onSend: (text: string) => void;
  onSkip: () => void;
};

export function ChatInputBar({ defaultValue, onSend, onSkip }: Props) {
  const [text, setText] = useState(defaultValue);
  const canSend = text.trim().length > 0;

  const handleSend = () => {
    if (canSend) onSend(text);
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm">
      <textarea
        aria-label="프루피에게 답하기"
        rows={3}
        value={text}
        maxLength={MAX_ANSWER_LENGTH}
        placeholder="답을 적어 주세요"
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.shiftKey) return;
          if (event.nativeEvent.isComposing) return;
          event.preventDefault();
          handleSend();
        }}
        className="w-full resize-none rounded-xl bg-gray-100 px-3 py-2 text-base text-ink placeholder:text-ink-mark"
      />
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onSkip}
          className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-ink transition-all duration-300 ease-smooth hover:scale-[1.03] hover:bg-gray-300 active:scale-[0.97]"
        >
          질문 넘기기
        </button>
        <Button size="sm" disabled={!canSend} onClick={handleSend}>
          보내기
        </Button>
      </div>
    </div>
  );
}

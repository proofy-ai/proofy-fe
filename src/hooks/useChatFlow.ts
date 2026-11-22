import { useState } from "react";

import { buildAnswerInputs, type ChatTurn } from "@/lib/chatAnswers";
import type { AgentQuestion } from "@/types/api";

export const useChatFlow = (questions: AgentQuestion[]) => {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const currentQuestion = questions[turns.length] ?? null;

  const reply = (answer: string | null) => {
    if (!currentQuestion) return;
    setTurns((previous) => [
      ...previous,
      { questionId: currentQuestion.questionId, answer },
    ]);
  };

  return {
    turns,
    currentQuestion,
    send: (text: string) => reply(text.trim() || null),
    skip: () => reply(null),
    answerInputs: buildAnswerInputs(turns),
  };
};

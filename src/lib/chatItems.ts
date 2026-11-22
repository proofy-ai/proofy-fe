import type { ChatTurn } from "@/lib/chatAnswers";
import type { AgentQuestion } from "@/types/api";

const INTRO_MESSAGE =
  "분석이 끝났어요! 더 정확한 소명서를 위해 몇 가지만 물어볼게요.";
const CLOSING_WITH_ANSWERS =
  "알려 주셔서 고마워요. 답해 주신 내용을 반영해서 다시 확인해 볼게요.";
const CLOSING_WITHOUT_ANSWERS = "알겠어요. 지금 자료로 결과를 보여 드릴게요.";
const MIN_TYPING_MS = 600;
const MAX_TYPING_MS = 1500;
const TYPING_MS_PER_CHARACTER = 14;

export type ChatItem =
  | { key: string; kind: "pruppy"; text: string }
  | { key: string; kind: "user"; answer: string | null };

export const buildChatItems = (
  questions: AgentQuestion[],
  turns: ChatTurn[],
  hasAnswers: boolean,
): ChatItem[] => {
  const items: ChatItem[] = [
    { key: "intro", kind: "pruppy", text: INTRO_MESSAGE },
  ];
  questions.slice(0, turns.length + 1).forEach((question, index) => {
    items.push({
      key: `q-${question.questionId}`,
      kind: "pruppy",
      text: question.text,
    });
    const turn = turns[index];
    if (turn) {
      items.push({
        key: `a-${question.questionId}`,
        kind: "user",
        answer: turn.answer,
      });
    }
  });
  if (turns.length >= questions.length) {
    items.push({
      key: "closing",
      kind: "pruppy",
      text: hasAnswers ? CLOSING_WITH_ANSWERS : CLOSING_WITHOUT_ANSWERS,
    });
  }
  return items;
};

export const getTypingDelay = (item: ChatItem) => {
  if (item.kind === "user") return 0;
  return Math.min(
    MAX_TYPING_MS,
    MIN_TYPING_MS + item.text.length * TYPING_MS_PER_CHARACTER,
  );
};

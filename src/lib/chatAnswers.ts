import type { AnswerInput } from "@/types/api";

export const MAX_ANSWER_LENGTH = 500;

export type ChatTurn = {
  questionId: string;
  answer: string | null;
};

export const buildAnswerInputs = (turns: ChatTurn[]): AnswerInput[] =>
  turns.flatMap(({ questionId, answer }) => {
    const trimmedAnswer = answer?.trim();
    return trimmedAnswer ? [{ questionId, answer: trimmedAnswer }] : [];
  });

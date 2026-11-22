import type { AgentQuestion, DraftSentence } from "@/types/api";

export const getAdviceQuestions = (
  sentence: DraftSentence,
  questions: AgentQuestion[],
) =>
  questions
    .filter((question) =>
      question.findingIds.some((findingId) =>
        sentence.findingIds.includes(findingId),
      ),
    )
    .map((question) => question.text);

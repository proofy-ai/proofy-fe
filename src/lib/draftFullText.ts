import { getSectionTitle } from "@/lib/draftEditing";
import type { DraftSentence } from "@/types/api";

export type DraftParagraph = {
  title: string | null;
  sentences: DraftSentence[];
};

export const getDraftSentenceElementId = (sentenceId: string) =>
  `draft-sentence-${sentenceId}`;

export const isHighlightedSentence = (sentence: DraftSentence) =>
  sentence.needsCheck && !sentence.confirmed;

export const groupSentencesIntoParagraphs = (
  sentences: DraftSentence[],
): DraftParagraph[] =>
  sentences.reduce<DraftParagraph[]>((paragraphs, sentence, index) => {
    const title = getSectionTitle(sentences, index);
    const lastParagraph = paragraphs[paragraphs.length - 1];
    if (title === null && lastParagraph) {
      lastParagraph.sentences.push(sentence);
      return paragraphs;
    }
    return [...paragraphs, { title, sentences: [sentence] }];
  }, []);

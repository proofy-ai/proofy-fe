import { DRAFT_SECTION_TITLES } from "@/lib/draftLabels";
import type { DraftSentence, DraftSentenceUpdate } from "@/types/api";

export const toSentenceUpdates = (
  sentences: DraftSentence[],
): DraftSentenceUpdate[] =>
  sentences.map(({ sentenceId, text, confirmed }) => ({
    sentenceId,
    text,
    confirmed,
  }));

export const withEditedText = (
  updates: DraftSentenceUpdate[],
  sentenceId: string,
  text: string,
) =>
  updates.map((update) =>
    update.sentenceId === sentenceId ? { ...update, text } : update,
  );

export const withConfirmed = (
  updates: DraftSentenceUpdate[],
  sentenceId: string,
  confirmed: boolean,
) =>
  updates.map((update) =>
    update.sentenceId === sentenceId ? { ...update, confirmed } : update,
  );

export const withoutSentence = (
  updates: DraftSentenceUpdate[],
  sentenceId: string,
) => updates.filter((update) => update.sentenceId !== sentenceId);

export const withAppendedSentence = (
  updates: DraftSentenceUpdate[],
  text: string,
): DraftSentenceUpdate[] => [...updates, { sentenceId: null, text }];

export const getSectionTitle = (sentences: DraftSentence[], index: number) => {
  const { section } = sentences[index];
  if (section === null || section === sentences[index - 1]?.section) {
    return null;
  }
  return DRAFT_SECTION_TITLES[section];
};

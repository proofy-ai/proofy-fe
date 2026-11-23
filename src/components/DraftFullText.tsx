import { Fragment } from "react";

import {
  getDraftSentenceElementId,
  groupSentencesIntoParagraphs,
  isHighlightedSentence,
} from "@/lib/draftFullText";
import type { DraftSentence } from "@/types/api";

type Props = {
  sentences: DraftSentence[];
};

const scrollToSentenceCard = (sentenceId: string) => {
  document
    .getElementById(getDraftSentenceElementId(sentenceId))
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
};

export function DraftFullText({ sentences }: Props) {
  const paragraphs = groupSentencesIntoParagraphs(sentences);

  return (
    <section
      aria-label="소명서 초안 전체"
      className="flex flex-col gap-3 rounded-2xl bg-white/70 p-4"
    >
      {paragraphs.map((paragraph) => (
        <div key={paragraph.sentences[0].sentenceId} className="flex flex-col">
          {paragraph.title && (
            <h3 className="text-xs font-bold text-ink-sub">
              {paragraph.title}
            </h3>
          )}
          <p className="break-keep text-sm leading-7 text-ink">
            {paragraph.sentences.map((sentence) => (
              <Fragment key={sentence.sentenceId}>
                {isHighlightedSentence(sentence) ? (
                  <button
                    type="button"
                    onClick={() => scrollToSentenceCard(sentence.sentenceId)}
                    className="rounded bg-warning-soft px-1 text-left underline decoration-warning decoration-2 underline-offset-4"
                  >
                    {sentence.text}
                  </button>
                ) : (
                  sentence.text
                )}{" "}
              </Fragment>
            ))}
          </p>
        </div>
      ))}
    </section>
  );
}

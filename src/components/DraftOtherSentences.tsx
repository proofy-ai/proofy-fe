import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Collapsible } from "@/components/common/Collapsible";
import { DraftSentenceCards } from "@/components/DraftSentenceCards";
import type { DraftSentence } from "@/types/api";

type CardProps = Parameters<typeof DraftSentenceCards>[0];

type Props = Omit<CardProps, "sentences"> & {
  sentences: DraftSentence[];
};

export function DraftOtherSentences({ sentences, ...cardProps }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex items-center justify-between text-sm font-bold text-ink"
      >
        그 밖의 문장 {sentences.length}
        <ChevronDown
          aria-hidden
          className={`h-5 w-5 text-ink-sub transition-transform duration-300 ease-smooth ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <Collapsible isOpen={isOpen}>
        <DraftSentenceCards sentences={sentences} {...cardProps} />
      </Collapsible>
    </div>
  );
}

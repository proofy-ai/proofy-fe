import { useState } from "react";

import { Collapsible } from "@/components/common/Collapsible";
import { DisclosureButton } from "@/components/common/DisclosureButton";
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
      <DisclosureButton
        title={`그 밖의 문장 ${sentences.length}`}
        isOpen={isOpen}
        onToggle={() => setIsOpen((previous) => !previous)}
      />
      <Collapsible isOpen={isOpen}>
        <DraftSentenceCards sentences={sentences} {...cardProps} />
      </Collapsible>
    </div>
  );
}

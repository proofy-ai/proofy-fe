import { useQuery } from "@tanstack/react-query";

import { listEvidence } from "@/api/evidence";
import { buildAttachmentLine, splitReasonPages } from "@/lib/objectionForm";
import type { Checklist, Draft } from "@/types/api";

export const useObjectionReasonPages = (
  caseId: string,
  caseToken: string,
  draft: Draft,
  checklist: Checklist,
) => {
  const evidenceQuery = useQuery({
    queryKey: ["evidence", caseId],
    queryFn: () => listEvidence(caseId, caseToken),
  });
  const attachmentLine = buildAttachmentLine(
    evidenceQuery.data?.items ?? [],
    checklist.items,
  );
  const reasonText = attachmentLine
    ? `${draft.fullText}\n\n${attachmentLine}`
    : draft.fullText;

  return {
    reasonPages: splitReasonPages(reasonText),
    isReasonLoading: evidenceQuery.isPending,
  };
};

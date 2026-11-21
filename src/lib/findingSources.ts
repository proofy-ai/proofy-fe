import { DOC_TYPE_LABELS } from "@/lib/docTypeLabels";
import type { FindingSource } from "@/types/api";

const DIRECTION_LABELS = { IN: "입금", OUT: "출금" };

export const describeSource = (source: FindingSource) => {
  switch (source.kind) {
    case "NARRATIVE":
      return { title: "내 사연", detail: `“${source.quote}”` };
    case "EVIDENCE":
      return {
        title: `${DOC_TYPE_LABELS[source.docType]} ${source.page}쪽`,
        detail: `“${source.quote}”`,
      };
    case "TRANSACTION": {
      const amount = `${source.amountKrw.toLocaleString("ko-KR")}원`;
      const counterparty = source.counterparty
        ? ` · ${source.counterparty}`
        : "";
      return {
        title: `거래내역 ${source.occurredAt.slice(0, 10)} ${DIRECTION_LABELS[source.direction]}`,
        detail: `${amount}${counterparty}`,
      };
    }
  }
};

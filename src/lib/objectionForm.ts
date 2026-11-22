import { DOC_TYPE_LABELS } from "@/lib/docTypeLabels";
import type { ChecklistItem, Evidence } from "@/types/api";

export type ObjectionFormFields = {
  applicantName: string;
  birthDate: string;
  address: string;
  phone: string;
  mobilePhone: string;
  email: string;
  financialCompany: string;
  branch: string;
  assetType: string;
  accountNumber: string;
  accountHolder: string;
  applicationDate: string;
};

export const PAGE_WIDTH_PX = 794;
export const PAGE_HEIGHT_PX = 1123;

const CHARS_PER_LINE = 48;
const FIRST_PAGE_LINES = 14;
const NEXT_PAGE_LINES = 38;

export const createEmptyFormFields = (
  applicationDate: string,
): ObjectionFormFields => ({
  applicantName: "",
  birthDate: "",
  address: "",
  phone: "",
  mobilePhone: "",
  email: "",
  financialCompany: "",
  branch: "",
  assetType: "",
  accountNumber: "",
  accountHolder: "",
  applicationDate,
});

export const formatApplicationDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return { year, month, day };
};

export const buildAttachmentLine = (
  evidence: Evidence[],
  checklistItems: ChecklistItem[],
) => {
  const uploadedNames = evidence.map((item) =>
    item.docType === "OTHER"
      ? item.originalName
      : DOC_TYPE_LABELS[item.docType],
  );
  const preparedNames = checklistItems
    .filter((item) => item.checked)
    .map((item) => item.label);
  const names = [...new Set([...uploadedNames, ...preparedNames])];
  return names.length > 0 ? `첨부 자료: ${names.join(", ")}.` : "";
};

const estimateLines = (text: string) =>
  Math.max(1, Math.ceil(text.length / CHARS_PER_LINE));

const splitSentences = (paragraph: string) =>
  paragraph.split(/(?<=[.!?])\s+/).filter((sentence) => sentence.length > 0);

const getPageCapacity = (pageIndex: number) =>
  pageIndex === 0 ? FIRST_PAGE_LINES : NEXT_PAGE_LINES;

export const splitReasonPages = (reasonText: string) => {
  const pages: string[] = [""];
  let usedLines = 0;

  const append = (piece: string, separator: string, cost: number) => {
    const pageIndex = pages.length - 1;
    if (usedLines + cost > getPageCapacity(pageIndex) && pages[pageIndex]) {
      pages.push(piece);
      usedLines = cost;
      return;
    }
    pages[pageIndex] += pages[pageIndex] ? separator + piece : piece;
    usedLines += cost;
  };

  reasonText.split("\n").forEach((paragraph) => {
    const sentences = splitSentences(paragraph);
    if (sentences.length === 0) {
      append("", "\n", 1);
      return;
    }
    sentences.forEach((sentence, index) =>
      append(sentence, index === 0 ? "\n" : " ", estimateLines(sentence)),
    );
  });

  const trimmedPages = pages.map((page) => page.trim()).filter(Boolean);
  return trimmedPages.length > 0 ? trimmedPages : [""];
};

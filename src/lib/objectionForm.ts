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

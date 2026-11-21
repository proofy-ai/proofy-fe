import type { Checklist, DocType } from "@/types/api";

export const getUploadDocTypes = (checklist: Checklist | undefined) => {
  const docTypes = new Set<DocType>();
  checklist?.items
    .filter(
      (item) =>
        item.status !== "NOT_COLLECTED" && item.acceptedDocTypes.length > 0,
    )
    .forEach((item) =>
      item.acceptedDocTypes.forEach((docType) => docTypes.add(docType)),
    );
  return [...docTypes];
};

export const getDefaultDocType = (checklist: Checklist | undefined) => {
  const items = checklist?.items.filter(
    (item) => item.acceptedDocTypes.length > 0,
  );
  const nextItem =
    items?.find(
      (item) => item.requiredForAnalysis && item.status === "MISSING",
    ) ??
    items?.find((item) => item.status === "MISSING") ??
    items?.[0];

  return nextItem?.acceptedDocTypes[0] ?? null;
};

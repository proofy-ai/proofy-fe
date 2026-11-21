export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_EVIDENCE_COUNT = 8;

export const findFileError = (file: File): string | null => {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return `${file.name}: JPG, PNG, PDF 파일만 올릴 수 있어요.`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return `${file.name}: 파일은 10MB 이하만 올릴 수 있어요.`;
  }
  return null;
};

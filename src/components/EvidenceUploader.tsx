import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { Upload } from "lucide-react";

const acceptedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
const maxFileBytes = 10 * 1024 * 1024;
const maxEvidenceCount = 8;

function findFileError(file: File): string | null {
  if (!acceptedMimeTypes.includes(file.type)) {
    return `${file.name}: JPG, PNG, PDF 파일만 올릴 수 있어요.`;
  }
  if (file.size > maxFileBytes) {
    return `${file.name}: 파일은 10MB 이하만 올릴 수 있어요.`;
  }
  return null;
}

interface EvidenceUploaderProps {
  evidenceCount: number;
  disabled?: boolean;
  onFilesAccepted: (files: File[]) => void;
}

export default function EvidenceUploader({
  evidenceCount,
  disabled = false,
  onFilesAccepted,
}: EvidenceUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  function receiveFiles(files: File[]) {
    const messages: string[] = [];
    const acceptedFiles: File[] = [];
    const remainingSlots = maxEvidenceCount - evidenceCount;
    let isLimitReported = false;

    for (const file of files) {
      const fileError = findFileError(file);
      if (fileError) {
        messages.push(fileError);
      } else if (acceptedFiles.length >= remainingSlots) {
        if (!isLimitReported) {
          messages.push(
            `서류는 사건당 ${maxEvidenceCount}개까지 올릴 수 있어요.`,
          );
          isLimitReported = true;
        }
      } else {
        acceptedFiles.push(file);
      }
    }

    setErrorMessages(messages);
    if (acceptedFiles.length > 0) onFilesAccepted(acceptedFiles);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    receiveFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) receiveFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-8 text-center ${
          isDragging ? "border-brand bg-brand-tint" : "border-brand-line"
        }`}
      >
        <Upload className="h-6 w-6 text-brand" aria-hidden />
        <p className="text-sm text-ink-sub">
          서류를 여기로 끌어 놓거나 버튼을 눌러 올려 주세요
        </p>
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors enabled:hover:bg-brand-strong disabled:opacity-50"
        >
          파일 선택
        </button>
        <p className="text-xs text-ink-faint">
          JPG, PNG, PDF · 10MB 이하 · {evidenceCount}/{maxEvidenceCount}개
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={handleInputChange}
          aria-label="증빙 서류 선택"
        />
      </div>
      {errorMessages.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1" role="alert">
          {errorMessages.map((message) => (
            <li key={message} className="text-sm text-danger">
              {message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

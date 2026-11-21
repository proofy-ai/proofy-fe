import type { RefObject } from "react";

import { GlassCard } from "@/components/common/GlassCard";
import { EvidenceList } from "@/components/EvidenceList";
import { EvidenceUploader } from "@/components/EvidenceUploader";
import { OptionGroup } from "@/components/OptionGroup";
import { SampleDownloadNotice } from "@/components/SampleDownloadNotice";
import { useDemoSamples } from "@/hooks/useDemoSamples";
import { useEvidenceFiles } from "@/hooks/useEvidenceFiles";
import { DOC_TYPE_LABELS } from "@/lib/docTypeLabels";
import { getSampleImageUrls } from "@/lib/sampleFiles";
import { getUploadDocTypes } from "@/lib/uploadDocTypes";
import type { Checklist, DocType, InflowType } from "@/types/api";

type Props = {
  caseId: string;
  caseToken: string;
  inflowType: InflowType;
  checklist: Checklist | undefined;
  docType: DocType | null;
  isTransactionRecordMissing: boolean;
  uploaderRef: RefObject<HTMLDivElement | null>;
  onDocTypeChange: (docType: DocType) => void;
};

export function EvidencePanel({
  caseId,
  caseToken,
  inflowType,
  checklist,
  docType,
  isTransactionRecordMissing,
  uploaderRef,
  onDocTypeChange,
}: Props) {
  const { isDemoMode, sampleFiles } = useDemoSamples(inflowType);
  const {
    evidenceItems,
    previewUrls,
    isUploading,
    uploadFiles,
    removeEvidence,
  } = useEvidenceFiles(caseId, caseToken);

  const imageUrls = {
    ...getSampleImageUrls(evidenceItems, sampleFiles),
    ...previewUrls,
  };
  const docTypeOptions = getUploadDocTypes(checklist).map((value) => ({
    value,
    label: DOC_TYPE_LABELS[value],
  }));

  const handleFilesAccepted = (files: File[]) => {
    if (docType) uploadFiles(files, docType);
  };

  return (
    <GlassCard title="증빙 서류">
      <div className="flex w-full flex-col gap-4">
        {isDemoMode && <SampleDownloadNotice sampleFiles={sampleFiles} />}

        {docType && (
          <OptionGroup
            legend="올리는 서류 종류"
            name="docType"
            options={docTypeOptions}
            value={docType}
            onChange={onDocTypeChange}
          />
        )}

        <div
          ref={uploaderRef}
          className={
            isTransactionRecordMissing
              ? "rounded-2xl ring-2 ring-danger"
              : undefined
          }
        >
          <EvidenceUploader
            evidenceCount={evidenceItems.length}
            disabled={!docType || isUploading}
            onFilesAccepted={handleFilesAccepted}
          />
        </div>

        {evidenceItems.length > 0 && (
          <EvidenceList
            items={evidenceItems}
            imageUrls={imageUrls}
            onDeleteClick={removeEvidence}
          />
        )}
      </div>
    </GlassCard>
  );
}

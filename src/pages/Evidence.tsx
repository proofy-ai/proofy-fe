import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { getCase } from "@/api/cases";
import { getChecklist } from "@/api/checklist";
import { AnalysisStartPanel } from "@/components/AnalysisStartPanel";
import { ChecklistPanel } from "@/components/ChecklistPanel";
import { GlassCard } from "@/components/common/GlassCard";
import { EvidencePanel } from "@/components/EvidencePanel";
import { NarrativeEditor } from "@/components/NarrativeEditor";
import { OverwriteDraftConfirm } from "@/components/OverwriteDraftConfirm";
import { ErrorState, LoadingState } from "@/components/StateViews";
import { StoredCaseGuard } from "@/components/StoredCaseGuard";
import { useAnalysisStart } from "@/hooks/useAnalysisStart";
import { getAnalysisBlockers } from "@/lib/analysisReadiness";
import { getDefaultDocType } from "@/lib/uploadDocTypes";
import type { CaseDetail, DocType } from "@/types/api";

type ContentProps = {
  caseId: string;
  caseToken: string;
  detail: CaseDetail;
};

function EvidenceContent({ caseId, caseToken, detail }: ContentProps) {
  const uploaderRef = useRef<HTMLDivElement>(null);
  const [narrative, setNarrative] = useState(detail.narrative ?? "");
  const [selectedDocType, setSelectedDocType] = useState<DocType | null>(null);

  const checklistQuery = useQuery({
    queryKey: ["checklist", caseId],
    queryFn: () => getChecklist(caseId, caseToken),
  });
  const analysisStart = useAnalysisStart(caseId, caseToken, narrative);

  const checklist = checklistQuery.data;
  const docType = selectedDocType ?? getDefaultDocType(checklist);
  const blockers = getAnalysisBlockers(narrative, checklist);

  const handleUploadClick = (nextDocType: DocType) => {
    setSelectedDocType(nextDocType);
    uploaderRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <OverwriteDraftConfirm
        isOpen={analysisStart.needsOverwriteConfirm}
        onConfirm={() => analysisStart.start(true)}
        onClose={analysisStart.dismissError}
      />
      <h1 className="text-2xl font-bold text-ink">사연과 증빙을 올려 주세요</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <GlassCard title="사연">
            <div className="w-full">
              <NarrativeEditor
                caseId={caseId}
                caseToken={caseToken}
                initialValue={detail.narrative ?? ""}
                value={narrative}
                hasError={analysisStart.missingItems.includes("NARRATIVE")}
                onValueChange={setNarrative}
              />
            </div>
          </GlassCard>
          <EvidencePanel
            caseId={caseId}
            caseToken={caseToken}
            inflowType={detail.inflow.type}
            checklist={checklist}
            docType={docType}
            isTransactionRecordMissing={analysisStart.missingItems.includes(
              "TRANSACTION_RECORD",
            )}
            uploaderRef={uploaderRef}
            onDocTypeChange={setSelectedDocType}
          />
        </div>

        <div className="flex flex-col gap-6">
          <ChecklistPanel
            checklistQuery={checklistQuery}
            onUploadClick={handleUploadClick}
          />
          <AnalysisStartPanel
            blockers={blockers}
            errorMessage={analysisStart.errorMessage}
            isPending={analysisStart.isPending}
            onStart={() => analysisStart.start()}
          />
        </div>
      </div>
    </div>
  );
}

type ScreenProps = {
  caseId: string;
  caseToken: string;
};

function EvidenceScreen({ caseId, caseToken }: ScreenProps) {
  const caseQuery = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => getCase(caseId, caseToken),
    retry: false,
  });

  if (caseQuery.isPending) return <LoadingState />;
  if (caseQuery.isError) {
    return (
      <ErrorState
        message={caseQuery.error.message}
        onRetry={() => caseQuery.refetch()}
      />
    );
  }

  return (
    <EvidenceContent
      caseId={caseId}
      caseToken={caseToken}
      detail={caseQuery.data.case}
    />
  );
}

export function Evidence() {
  const { caseId = "" } = useParams();

  return (
    <StoredCaseGuard caseId={caseId}>
      {(storedCase) => (
        <EvidenceScreen
          caseId={storedCase.caseId}
          caseToken={storedCase.caseToken}
        />
      )}
    </StoredCaseGuard>
  );
}

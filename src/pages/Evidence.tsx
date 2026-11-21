import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { startAnalysis } from "@/api/analysis";
import { getCase } from "@/api/cases";
import { getChecklist } from "@/api/checklist";
import { ApiError, resolveApiUrl } from "@/api/client";
import { deleteEvidence, listEvidence, uploadEvidence } from "@/api/evidence";
import { getHealth, getSamples } from "@/api/meta";
import { ChecklistSection } from "@/components/ChecklistSection";
import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { EvidenceList } from "@/components/EvidenceList";
import { EvidenceUploader } from "@/components/EvidenceUploader";
import { NarrativeEditor } from "@/components/NarrativeEditor";
import { OptionGroup } from "@/components/OptionGroup";
import { EmptyState, ErrorState, LoadingState } from "@/components/StateViews";
import {
  getAnalysisBlockers,
  getServerMissingItems,
} from "@/lib/analysisReadiness";
import { readStoredCases } from "@/lib/caseStorage";
import { DOC_TYPE_LABELS } from "@/lib/docTypeLabels";
import { getSampleImageUrls } from "@/lib/sampleImageUrls";
import { getDefaultDocType, getUploadDocTypes } from "@/lib/uploadDocTypes";
import { useToastStore } from "@/store/toastStore";
import type { CaseDetail, DocType } from "@/types/api";

type ContentProps = {
  caseId: string;
  caseToken: string;
  detail: CaseDetail;
};

function EvidenceContent({ caseId, caseToken, detail }: ContentProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.show);
  const uploaderRef = useRef<HTMLDivElement>(null);
  const [narrative, setNarrative] = useState(detail.narrative ?? "");
  const [selectedDocType, setSelectedDocType] = useState<DocType | "">("");
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  const checklistQuery = useQuery({
    queryKey: ["checklist", caseId],
    queryFn: () => getChecklist(caseId, caseToken),
  });
  const evidenceQuery = useQuery({
    queryKey: ["evidence", caseId],
    queryFn: () => listEvidence(caseId, caseToken),
  });
  const healthQuery = useQuery({ queryKey: ["health"], queryFn: getHealth });
  const samplesQuery = useQuery({ queryKey: ["samples"], queryFn: getSamples });

  const uploadMutation = useMutation({
    mutationFn: ({ file, docType }: { file: File; docType: DocType }) =>
      uploadEvidence(caseId, caseToken, file, docType),
  });
  const deleteMutation = useMutation({
    mutationFn: (evidenceId: string) =>
      deleteEvidence(caseId, caseToken, evidenceId),
  });
  const analysisMutation = useMutation({
    mutationFn: () =>
      startAnalysis(caseId, caseToken, {
        narrative,
        overwriteEditedDraft: false,
      }),
  });

  const checklist = checklistQuery.data;
  const evidenceItems = evidenceQuery.data?.items ?? [];
  const uploadDocTypes = getUploadDocTypes(checklist);
  const docType = selectedDocType || getDefaultDocType(checklist);
  const blockers = getAnalysisBlockers(narrative, checklist);
  const missingItems =
    analysisMutation.error instanceof ApiError
      ? getServerMissingItems(analysisMutation.error)
      : [];

  const sampleSets = samplesQuery.data?.items ?? [];
  const matchingSampleSets = sampleSets.filter(
    (set) => set.scenario === detail.inflow.type,
  );
  const sampleFiles = (
    matchingSampleSets.length > 0 ? matchingSampleSets : sampleSets
  ).flatMap((set) => set.files);
  const listImageUrls = {
    ...getSampleImageUrls(evidenceItems, sampleFiles),
    ...imageUrls,
  };

  const refreshCase = () =>
    ["case", "checklist", "evidence"].forEach((key) =>
      queryClient.invalidateQueries({ queryKey: [key, caseId] }),
    );

  const handleFilesAccepted = async (files: File[]) => {
    if (!docType) return;

    for (const file of files) {
      try {
        const { evidence } = await uploadMutation.mutateAsync({
          file,
          docType,
        });
        if (file.type.startsWith("image/")) {
          const previewUrl = URL.createObjectURL(file);
          setImageUrls((current) => ({
            ...current,
            [evidence.evidenceId]: previewUrl,
          }));
        }
      } catch (error) {
        if (error instanceof Error) showToast(error.message, "error");
        break;
      }
    }
    refreshCase();
  };

  const handleEvidenceDelete = (evidenceId: string) =>
    deleteMutation.mutate(evidenceId, {
      onSuccess: refreshCase,
      onError: (error) => showToast(error.message, "error"),
    });

  const handleUploadClick = (nextDocType: DocType) => {
    setSelectedDocType(nextDocType);
    uploaderRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleAnalysisStart = () =>
    analysisMutation.mutate(undefined, {
      onSuccess: () => navigate(`/cases/${caseId}/analysis`),
      onError: (error) => {
        if (
          error instanceof ApiError &&
          error.code === "ANALYSIS_IN_PROGRESS"
        ) {
          navigate(`/cases/${caseId}/analysis`);
        }
      },
    });

  return (
    <div className="flex flex-col gap-6">
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
                hasError={missingItems.includes("NARRATIVE")}
                onValueChange={setNarrative}
              />
            </div>
          </GlassCard>

          <GlassCard title="증빙 서류">
            <div className="flex w-full flex-col gap-4">
              {healthQuery.data?.demoMode && (
                <>
                  <p className="break-keep text-sm text-ink-sub">
                    시연용 서비스입니다. 실제 서류 대신 샘플(합성) 서류만 올려
                    주세요.
                  </p>
                  {sampleFiles.length > 0 && (
                    <ul className="flex flex-col gap-1 rounded-xl bg-brand-soft px-4 py-3">
                      {sampleFiles.map((file) => (
                        <li key={file.url}>
                          <a
                            href={resolveApiUrl(file.url)}
                            download={file.name}
                            className="text-sm text-ink underline"
                          >
                            샘플 서류 받기: {file.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {docType && (
                <OptionGroup
                  legend="올리는 서류 종류"
                  name="docType"
                  options={uploadDocTypes.map((value) => ({
                    value,
                    label: DOC_TYPE_LABELS[value],
                  }))}
                  value={docType}
                  onChange={setSelectedDocType}
                />
              )}

              <div
                ref={uploaderRef}
                className={
                  missingItems.includes("TRANSACTION_RECORD")
                    ? "rounded-2xl ring-2 ring-danger"
                    : undefined
                }
              >
                <EvidenceUploader
                  evidenceCount={evidenceItems.length}
                  disabled={!docType || uploadMutation.isPending}
                  onFilesAccepted={handleFilesAccepted}
                />
              </div>

              {evidenceItems.length > 0 && (
                <EvidenceList
                  items={evidenceItems}
                  imageUrls={listImageUrls}
                  onDeleteClick={handleEvidenceDelete}
                />
              )}
            </div>
          </GlassCard>
        </div>

        <div className="flex flex-col gap-6">
          <GlassCard title="필요한 서류">
            {checklistQuery.isPending && <LoadingState />}
            {checklistQuery.isError && (
              <ErrorState
                message={checklistQuery.error.message}
                onRetry={() => checklistQuery.refetch()}
              />
            )}
            {checklist && (
              <ChecklistSection
                checklist={checklist}
                onUploadClick={handleUploadClick}
              />
            )}
          </GlassCard>

          <GlassCard title="분석 시작">
            <div className="flex w-full flex-col gap-3">
              {blockers.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {blockers.map((blocker) => (
                    <li
                      key={blocker}
                      className="break-keep text-sm text-ink-sub"
                    >
                      · {blocker}
                    </li>
                  ))}
                </ul>
              )}
              {analysisMutation.error && (
                <p
                  role="alert"
                  className="whitespace-pre-line text-sm text-danger"
                >
                  {analysisMutation.error.message}
                </p>
              )}
              <GradientButton
                fullWidth
                disabled={blockers.length > 0 || analysisMutation.isPending}
                onClick={handleAnalysisStart}
              >
                분석 시작
              </GradientButton>
            </div>
          </GlassCard>
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
  const storedCase = readStoredCases().find(
    (storedItem) => storedItem.caseId === caseId,
  );

  if (!storedCase) {
    return (
      <EmptyState
        title="사건을 찾을 수 없어요"
        description="이 브라우저에 저장된 사건이 아니에요."
        action={
          <Link to="/me" className="text-sm font-medium text-ink underline">
            내 사건으로 가기
          </Link>
        }
      />
    );
  }

  return (
    <EvidenceScreen
      caseId={storedCase.caseId}
      caseToken={storedCase.caseToken}
    />
  );
}

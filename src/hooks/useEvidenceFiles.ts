import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteEvidence, listEvidence, uploadEvidence } from "@/api/evidence";
import { useEvidencePreviews } from "@/hooks/useEvidencePreviews";
import { useToastStore } from "@/store/toastStore";
import type { DocType } from "@/types/api";

export const useEvidenceFiles = (caseId: string, caseToken: string) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.show);
  const { previewUrls, addPreview, removePreview } = useEvidencePreviews();

  const evidenceQuery = useQuery({
    queryKey: ["evidence", caseId],
    queryFn: () => listEvidence(caseId, caseToken),
  });
  const uploadMutation = useMutation({
    mutationFn: ({ file, docType }: { file: File; docType: DocType }) =>
      uploadEvidence(caseId, caseToken, file, docType),
  });
  const deleteMutation = useMutation({
    mutationFn: (evidenceId: string) =>
      deleteEvidence(caseId, caseToken, evidenceId),
  });

  const refreshCase = () =>
    ["case", "checklist", "evidence"].forEach((key) =>
      queryClient.invalidateQueries({ queryKey: [key, caseId] }),
    );

  const uploadFiles = async (files: File[], docType: DocType) => {
    for (const file of files) {
      try {
        const { evidence } = await uploadMutation.mutateAsync({
          file,
          docType,
        });
        if (file.type.startsWith("image/")) {
          addPreview(evidence.evidenceId, file);
        }
      } catch (error) {
        if (error instanceof Error) showToast(error.message, "error");
        break;
      }
    }
    refreshCase();
  };

  const removeEvidence = (evidenceId: string) =>
    deleteMutation.mutate(evidenceId, {
      onSuccess: () => {
        removePreview(evidenceId);
        refreshCase();
      },
      onError: (error) => showToast(error.message, "error"),
    });

  return {
    evidenceItems: evidenceQuery.data?.items ?? [],
    previewUrls,
    isUploading: uploadMutation.isPending,
    uploadFiles,
    removeEvidence,
  };
};

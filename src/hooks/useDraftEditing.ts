import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDraft } from "@/api/draft";
import { useToastStore } from "@/store/toastStore";
import type { DraftSentenceUpdate } from "@/types/api";

export const useDraftEditing = (
  caseId: string,
  caseToken: string,
  version: number,
) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.show);
  const mutation = useMutation({
    mutationFn: (sentences: DraftSentenceUpdate[]) =>
      updateDraft(caseId, caseToken, { expectedVersion: version, sentences }),
    onSuccess: () => showToast("저장했어요", "success"),
    onError: (error) => showToast(error.message, "error"),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["result", caseId] }),
  });

  return { save: mutation.mutate, isSaving: mutation.isPending };
};

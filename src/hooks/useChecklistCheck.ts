import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateChecklistItem } from "@/api/checklist";
import { useToastStore } from "@/store/toastStore";

export const useChecklistCheck = (caseId: string, caseToken: string) => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.show);
  const mutation = useMutation({
    mutationFn: ({ itemId, checked }: { itemId: string; checked: boolean }) =>
      updateChecklistItem(caseId, caseToken, itemId, checked),
    onSuccess: () => {
      showToast("저장했어요", "success");
      ["result", "checklist"].forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key, caseId] }),
      );
    },
    onError: (error) => showToast(error.message, "error"),
  });

  return {
    setChecked: (itemId: string, checked: boolean) =>
      mutation.mutate({ itemId, checked }),
    pendingItemId: mutation.isPending ? mutation.variables.itemId : null,
  };
};

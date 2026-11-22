import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { deleteCase } from "@/api/cases";
import { isCaseGone } from "@/hooks/useMyCases";
import { removeStoredCase } from "@/lib/caseStorage";
import { useObjectionFormStore } from "@/store/objectionFormStore";
import { useToastStore } from "@/store/toastStore";

export const useDeleteCase = (caseId: string, caseToken: string) => {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.show);
  const clearFormFields = useObjectionFormStore((state) => state.clear);
  const mutation = useMutation({
    mutationFn: async () => {
      try {
        await deleteCase(caseId, caseToken);
      } catch (error) {
        if (!isCaseGone(error)) throw error;
      }
    },
    onSuccess: () => {
      removeStoredCase(caseId);
      clearFormFields(caseId);
      showToast("사건을 지웠어요", "success");
      navigate("/");
    },
    onError: (error) => showToast(error.message, "error"),
  });

  return {
    deleteCase: () => mutation.mutate(),
    isDeleting: mutation.isPending,
  };
};

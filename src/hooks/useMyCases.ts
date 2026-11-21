import { useMutation, useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { deleteCase, getCase } from "@/api/cases";
import { ApiError } from "@/api/client";
import { readStoredCases, removeStoredCase } from "@/lib/caseStorage";
import { useToastStore } from "@/store/toastStore";
import type { StoredCase } from "@/types/api";

const UNAUTHORIZED_STATUS = 401;
const NOT_FOUND_STATUS = 404;

export const isCaseGone = (error: unknown) =>
  error instanceof ApiError &&
  (error.status === UNAUTHORIZED_STATUS || error.status === NOT_FOUND_STATUS);

export const useMyCases = () => {
  const showToast = useToastStore((state) => state.show);
  const [storedCases, setStoredCases] = useState(readStoredCases);

  const caseQueries = useQueries({
    queries: storedCases.map((storedCase) => ({
      queryKey: ["case", storedCase.caseId],
      queryFn: () => getCase(storedCase.caseId, storedCase.caseToken),
      retry: false,
    })),
  });

  const isGone = (index: number) => isCaseGone(caseQueries[index].error);

  useEffect(() => {
    storedCases.forEach(({ caseId }, index) => {
      if (isCaseGone(caseQueries[index].error)) removeStoredCase(caseId);
    });
  }, [caseQueries, storedCases]);

  const deleteMutation = useMutation({
    mutationFn: async ({ caseId, caseToken }: StoredCase) => {
      try {
        await deleteCase(caseId, caseToken);
      } catch (error) {
        if (!isCaseGone(error)) throw error;
      }
    },
    onSuccess: (_, { caseId }) => {
      removeStoredCase(caseId);
      setStoredCases(readStoredCases());
    },
    onError: (error) => showToast(error.message, "error"),
  });

  const visibleCases = storedCases
    .map((storedCase, index) => ({
      storedCase,
      query: caseQueries[index],
      index,
    }))
    .filter(({ index }) => !isGone(index));

  return {
    cases: visibleCases.map(({ storedCase, query }) => ({ storedCase, query })),
    removedCount: storedCases.length - visibleCases.length,
    deleteMyCase: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};

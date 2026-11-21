import { useMutation } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";

import { createCase } from "@/api/cases";
import { ApiError } from "@/api/client";
import { addStoredCase } from "@/lib/caseStorage";
import { getKoreaToday } from "@/lib/koreaDate";
import {
  getServerFieldErrors,
  INITIAL_SITUATION_VALUES,
  type SituationErrors,
  type SituationValueChange,
  type SituationValues,
  toCaseInput,
  validateSituation,
} from "@/lib/situation";

export const useSituationForm = () => {
  const today = getKoreaToday();
  const [values, setValues] = useState<SituationValues>(
    INITIAL_SITUATION_VALUES,
  );
  const [errors, setErrors] = useState<SituationErrors>({});
  const mutation = useMutation({ mutationFn: createCase });

  const handleValueChange: SituationValueChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validateSituation(values, today);
    setErrors(validationErrors);

    const caseInput = toCaseInput(values);
    if (Object.keys(validationErrors).length > 0 || !caseInput) return;

    mutation.mutate(caseInput, {
      onSuccess: ({ caseId, caseToken, case: createdCase }) =>
        addStoredCase({
          caseId,
          caseToken,
          createdAt: createdCase.createdAt,
          sampleScenario: null,
        }),
      onError: (error) => {
        if (error instanceof ApiError) setErrors(getServerFieldErrors(error));
      },
    });
  };

  const submitError =
    mutation.error instanceof ApiError &&
    mutation.error.code !== "VALIDATION_ERROR"
      ? mutation.error.message
      : null;

  return {
    values,
    errors,
    today,
    createdCase: mutation.data ?? null,
    isSubmitting: mutation.isPending,
    submitError,
    handleValueChange,
    handleSubmit,
  };
};

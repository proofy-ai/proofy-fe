import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { updateCase } from "@/api/cases";

const AUTOSAVE_DELAY_MILLISECONDS = 1000;
const MAX_NARRATIVE_LENGTH = 2000;

type Props = {
  caseId: string;
  caseToken: string;
  initialValue: string;
  value: string;
  hasError: boolean;
  onValueChange: (value: string) => void;
};

export function NarrativeEditor({
  caseId,
  caseToken,
  initialValue,
  value,
  hasError,
  onValueChange,
}: Props) {
  const queryClient = useQueryClient();
  const [savedValue, setSavedValue] = useState(initialValue);
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (narrative: string) =>
      updateCase(caseId, caseToken, { narrative }),
  });

  useEffect(() => {
    if (value === savedValue) return;

    const timerId = setTimeout(() => {
      mutate(value, {
        onSuccess: () => {
          setSavedValue(value);
          queryClient.invalidateQueries({ queryKey: ["case", caseId] });
        },
      });
    }, AUTOSAVE_DELAY_MILLISECONDS);

    return () => clearTimeout(timerId);
  }, [value, savedValue, mutate, queryClient, caseId]);

  let saveStatus = "입력 중";
  if (isPending) saveStatus = "저장 중…";
  else if (isError) saveStatus = "저장하지 못했어요";
  else if (value === savedValue) saveStatus = "저장됨";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="narrative" className="text-sm font-medium text-ink">
        어떤 일이 있었는지 적어 주세요
      </label>
      <textarea
        id="narrative"
        rows={6}
        maxLength={MAX_NARRATIVE_LENGTH}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder="언제, 누구와, 어떤 거래를 했고 돈을 어떻게 받았는지 적어 주세요."
        className={`w-full resize-y rounded-xl border bg-white/80 px-4 py-3 text-base text-ink placeholder:text-ink-mark ${
          hasError ? "border-danger ring-2 ring-danger" : "border-brand-line"
        }`}
      />
      <div className="flex items-center justify-between text-xs text-ink-faint">
        <span role="status">{saveStatus}</span>
        <span>
          {value.length}/{MAX_NARRATIVE_LENGTH}
        </span>
      </div>
    </div>
  );
}

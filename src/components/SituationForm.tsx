import type { FormEvent } from "react";

import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { OptionGroup } from "@/components/OptionGroup";
import { SituationDateFields } from "@/components/SituationDateFields";
import { SituationInflowFields } from "@/components/SituationInflowFields";
import type {
  PriorFreezeAnswer,
  SituationErrors,
  SituationValueChange,
  SituationValues,
} from "@/lib/situation";

const PRIOR_FREEZE_OPTIONS = [
  { value: "no", label: "아니요" },
  { value: "yes", label: "예" },
  { value: "unknown", label: "모름" },
] satisfies { value: PriorFreezeAnswer; label: string }[];

type Props = {
  values: SituationValues;
  errors: SituationErrors;
  today: string;
  isSubmitting: boolean;
  submitError: string | null;
  onValueChange: SituationValueChange;
  onSubmit: (event: FormEvent) => void;
};

export function SituationForm({
  values,
  errors,
  today,
  isSubmitting,
  submitError,
  onValueChange,
  onSubmit,
}: Props) {
  return (
    <GlassCard>
      <form
        noValidate
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-5"
      >
        <SituationDateFields
          values={values}
          errors={errors}
          today={today}
          onValueChange={onValueChange}
        />
        <SituationInflowFields
          values={values}
          errors={errors}
          today={today}
          onValueChange={onValueChange}
        />
        <OptionGroup
          legend="이전에 지급정지를 받은 적이 있나요?"
          name="priorFreezeAnswer"
          options={PRIOR_FREEZE_OPTIONS}
          value={values.priorFreezeAnswer}
          onChange={(value) => onValueChange("priorFreezeAnswer", value)}
          error={errors.priorFreezeAnswer}
        />

        {submitError && (
          <p role="alert" className="whitespace-pre-line text-sm text-danger">
            {submitError}
          </p>
        )}

        <GradientButton fullWidth disabled={isSubmitting}>
          다음
        </GradientButton>
      </form>
    </GlassCard>
  );
}

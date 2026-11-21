import { FormField } from "@/components/FormField";
import { OptionGroup } from "@/components/OptionGroup";
import { INPUT_CLASS } from "@/lib/formClassNames";
import type {
  SituationErrors,
  SituationValueChange,
  SituationValues,
} from "@/lib/situation";
import type { InflowType } from "@/types/api";

const INFLOW_TYPE_OPTIONS = [
  { value: "GOODS", label: "물품 거래 대금" },
  { value: "UNEXPECTED", label: "모르는 입금" },
  { value: "SALARY", label: "급여" },
] satisfies { value: InflowType; label: string }[];

type Props = {
  values: SituationValues;
  errors: SituationErrors;
  today: string;
  onValueChange: SituationValueChange;
};

export function SituationInflowFields({
  values,
  errors,
  today,
  onValueChange,
}: Props) {
  return (
    <>
      <OptionGroup
        legend="입금 유형"
        name="inflowType"
        options={INFLOW_TYPE_OPTIONS}
        value={values.inflowType}
        onChange={(value) => onValueChange("inflowType", value)}
        error={errors.inflowType}
      />

      <FormField label="입금액(원)" htmlFor="amount" error={errors.amount}>
        <input
          id="amount"
          type="text"
          inputMode="numeric"
          placeholder="150000"
          value={values.amount}
          onChange={(event) =>
            onValueChange("amount", event.target.value.replace(/\D/g, ""))
          }
          className={INPUT_CLASS}
        />
      </FormField>

      <FormField
        label="입금된 날(선택)"
        htmlFor="occurredAt"
        hint="모르면 비워 두세요."
        error={errors.occurredAt}
      >
        <input
          id="occurredAt"
          type="date"
          max={today}
          value={values.occurredAt}
          onChange={(event) => onValueChange("occurredAt", event.target.value)}
          className={INPUT_CLASS}
        />
      </FormField>
    </>
  );
}

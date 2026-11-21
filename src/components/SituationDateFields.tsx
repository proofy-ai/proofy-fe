import { FormField } from "@/components/FormField";
import { INPUT_CLASS } from "@/lib/formClassNames";
import type {
  SituationErrors,
  SituationValueChange,
  SituationValues,
} from "@/lib/situation";

type Props = {
  values: SituationValues;
  errors: SituationErrors;
  today: string;
  onValueChange: SituationValueChange;
};

export function SituationDateFields({
  values,
  errors,
  today,
  onValueChange,
}: Props) {
  return (
    <>
      <FormField
        label="지급정지 통지를 받은 날"
        htmlFor="noticeReceivedDate"
        error={errors.noticeReceivedDate}
      >
        <input
          id="noticeReceivedDate"
          type="date"
          max={today}
          value={values.noticeReceivedDate}
          onChange={(event) =>
            onValueChange("noticeReceivedDate", event.target.value)
          }
          className={INPUT_CLASS}
        />
      </FormField>

      <div className="flex flex-col gap-2">
        <FormField
          label="채권소멸절차 공고일"
          htmlFor="publicNoticeDate"
          hint="금융감독원 공고에 나온 날짜예요. 통지일보다 앞서도 괜찮아요."
          error={errors.publicNoticeDate}
        >
          <input
            id="publicNoticeDate"
            type="date"
            max={today}
            value={values.publicNoticeDate}
            disabled={values.isPublicNoticeDateUnknown}
            onChange={(event) =>
              onValueChange("publicNoticeDate", event.target.value)
            }
            className={INPUT_CLASS}
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={values.isPublicNoticeDateUnknown}
            onChange={(event) =>
              onValueChange("isPublicNoticeDateUnknown", event.target.checked)
            }
          />
          공고일을 잘 모르겠어요
        </label>
      </div>
    </>
  );
}

import { useMutation } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createCase } from "@/api/cases";
import { ApiError } from "@/api/client";
import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { DeadlineBadge } from "@/components/DeadlineBadge";
import { FormField } from "@/components/FormField";
import { OptionGroup } from "@/components/OptionGroup";
import { addStoredCase } from "@/lib/caseStorage";
import { getKoreaToday } from "@/lib/koreaDate";
import {
  getServerFieldErrors,
  INITIAL_SITUATION_VALUES,
  type PriorFreezeAnswer,
  type SituationErrors,
  type SituationValues,
  toCaseInput,
  validateSituation,
} from "@/lib/situation";
import type { InflowType } from "@/types/api";

const INFLOW_TYPE_OPTIONS = [
  { value: "GOODS", label: "물품 거래 대금" },
  { value: "UNEXPECTED", label: "모르는 입금" },
  { value: "SALARY", label: "급여" },
] satisfies { value: InflowType; label: string }[];

const PRIOR_FREEZE_OPTIONS = [
  { value: "no", label: "아니요" },
  { value: "yes", label: "예" },
  { value: "unknown", label: "모름" },
] satisfies { value: PriorFreezeAnswer; label: string }[];

const INPUT_CLASS =
  "w-full rounded-xl border border-brand-line bg-white/80 px-4 py-3 text-base text-ink disabled:opacity-50";

export function Situation() {
  const navigate = useNavigate();
  const today = getKoreaToday();
  const [values, setValues] = useState<SituationValues>(
    INITIAL_SITUATION_VALUES,
  );
  const [errors, setErrors] = useState<SituationErrors>({});
  const createCaseMutation = useMutation({ mutationFn: createCase });

  const handleValueChange = <Key extends keyof SituationValues>(
    key: Key,
    value: SituationValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validateSituation(values, today);
    setErrors(validationErrors);

    const caseInput = toCaseInput(values);
    if (Object.keys(validationErrors).length > 0 || !caseInput) return;

    createCaseMutation.mutate(caseInput, {
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

  if (createCaseMutation.data) {
    const { caseId, case: createdCase } = createCaseMutation.data;

    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <h1 className="text-2xl font-bold text-ink">내 상황을 저장했어요</h1>
        <GlassCard title="이의제기 남은 기한">
          <div className="flex w-full flex-col gap-3">
            <div>
              <DeadlineBadge deadline={createdCase.deadline} />
            </div>
            <p className="break-keep text-ink">{createdCase.deadline.basis}</p>
            <p className="break-keep text-sm text-ink-sub">
              {createdCase.deadline.notice}
            </p>
            <GradientButton
              fullWidth
              onClick={() => navigate(`/cases/${caseId}/evidence`)}
            >
              사연·증빙 작성하기
            </GradientButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  const submitError =
    createCaseMutation.error instanceof ApiError &&
    createCaseMutation.error.code !== "VALIDATION_ERROR"
      ? createCaseMutation.error.message
      : null;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">내 상황을 알려 주세요</h1>
        <p className="mt-2 break-keep text-ink-sub">
          이름, 연락처, 계좌번호는 받지 않아요. 날짜와 금액만 입력해 주세요.
        </p>
      </div>

      <GlassCard>
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-5"
        >
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
                handleValueChange("noticeReceivedDate", event.target.value)
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
                  handleValueChange("publicNoticeDate", event.target.value)
                }
                className={INPUT_CLASS}
              />
            </FormField>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={values.isPublicNoticeDateUnknown}
                onChange={(event) => {
                  handleValueChange(
                    "isPublicNoticeDateUnknown",
                    event.target.checked,
                  );
                }}
              />
              공고일을 잘 모르겠어요
            </label>
          </div>

          <OptionGroup
            legend="입금 유형"
            name="inflowType"
            options={INFLOW_TYPE_OPTIONS}
            value={values.inflowType}
            onChange={(value) => handleValueChange("inflowType", value)}
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
                handleValueChange(
                  "amount",
                  event.target.value.replace(/\D/g, ""),
                )
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
              onChange={(event) =>
                handleValueChange("occurredAt", event.target.value)
              }
              className={INPUT_CLASS}
            />
          </FormField>

          <OptionGroup
            legend="이전에 지급정지를 받은 적이 있나요?"
            name="priorFreezeAnswer"
            options={PRIOR_FREEZE_OPTIONS}
            value={values.priorFreezeAnswer}
            onChange={(value) => handleValueChange("priorFreezeAnswer", value)}
            error={errors.priorFreezeAnswer}
          />

          {submitError && (
            <p role="alert" className="whitespace-pre-line text-sm text-danger">
              {submitError}
            </p>
          )}

          <GradientButton fullWidth disabled={createCaseMutation.isPending}>
            다음
          </GradientButton>
        </form>
      </GlassCard>
    </div>
  );
}

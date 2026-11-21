import { SituationForm } from "@/components/SituationForm";
import { SituationSaved } from "@/components/SituationSaved";
import { useSituationForm } from "@/hooks/useSituationForm";

export function Situation() {
  const form = useSituationForm();

  if (form.createdCase)
    return <SituationSaved createdCase={form.createdCase} />;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">내 상황을 알려 주세요</h1>
        <p className="mt-2 break-keep text-ink-sub">
          이름, 연락처, 계좌번호는 받지 않아요. 날짜와 금액만 입력해 주세요.
        </p>
      </div>
      <SituationForm
        values={form.values}
        errors={form.errors}
        today={form.today}
        isSubmitting={form.isSubmitting}
        submitError={form.submitError}
        onValueChange={form.handleValueChange}
        onSubmit={form.handleSubmit}
      />
    </div>
  );
}

import { GlassCard } from "@/components/common/GlassCard";
import {
  AFTER_SUBMIT_STEPS,
  FALSE_OBJECTION_WARNING,
} from "@/lib/guideContent";

export function GuideSubmitInfo() {
  return (
    <>
      <GlassCard title="제출한 뒤에는">
        <div className="flex w-full flex-col gap-3">
          <ol className="flex list-decimal flex-col gap-1 pl-5 text-ink">
            {AFTER_SUBMIT_STEPS.map((step) => (
              <li key={step} className="break-keep">
                {step}
              </li>
            ))}
          </ol>
          <p className="break-keep text-sm text-danger">
            {FALSE_OBJECTION_WARNING}
          </p>
        </div>
      </GlassCard>
    </>
  );
}

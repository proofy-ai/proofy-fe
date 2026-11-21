import { useNavigate } from "react-router-dom";

import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { DeadlineBadge } from "@/components/DeadlineBadge";
import { getEvidencePath } from "@/lib/casePaths";
import type { CreatedCaseResponse } from "@/types/api";

type Props = {
  createdCase: CreatedCaseResponse;
};

export function SituationSaved({ createdCase }: Props) {
  const navigate = useNavigate();
  const { deadline } = createdCase.case;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">내 상황을 저장했어요</h1>
      <GlassCard title="이의제기 남은 기한">
        <div className="flex w-full flex-col gap-3">
          <div>
            <DeadlineBadge deadline={deadline} />
          </div>
          <p className="break-keep text-ink">{deadline.basis}</p>
          <p className="break-keep text-sm text-ink-sub">{deadline.notice}</p>
          <GradientButton
            fullWidth
            onClick={() => navigate(getEvidencePath(createdCase.caseId))}
          >
            사연·증빙 작성하기
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
}

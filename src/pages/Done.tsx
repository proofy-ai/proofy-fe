import { useNavigate, useParams } from "react-router-dom";

import { GradientButton } from "@/components/common/GradientButton";
import { GuideSubmitInfo } from "@/components/GuideSubmitInfo";
import { SuccessCheck } from "@/components/SuccessCheck";
import { getResultPath } from "@/lib/casePaths";

export function Done() {
  const { caseId = "" } = useParams();
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8 pt-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <SuccessCheck />
        <h1 className="whitespace-pre-line break-keep text-xl font-bold text-ink">
          {"이의제기신청서 초안을 모두 작성해서\nPDF를 저장했어요."}
        </h1>
      </div>
      <div className="w-full">
        <GuideSubmitInfo />
      </div>
      <div className="flex w-full flex-col items-center gap-3">
        <GradientButton fullWidth onClick={() => navigate("/me")}>
          내 사건 보기
        </GradientButton>
        <button
          type="button"
          onClick={() =>
            navigate(getResultPath(caseId), { state: { tab: "GUIDE" } })
          }
          className="text-sm text-ink-sub underline"
        >
          신청서로 돌아가기
        </button>
      </div>
    </div>
  );
}

import { useNavigate, useParams } from "react-router-dom";

import { GradientButton } from "@/components/common/GradientButton";
import { GuideSubmitInfo } from "@/components/GuideSubmitInfo";
import { SuccessCheck } from "@/components/SuccessCheck";
import { getResultPath } from "@/lib/casePaths";

const REVEAL_CLASS = "animate-bubble-in motion-reduce:animate-none";
const TITLE_DELAY_MS = 400;
const CARD_DELAY_MS = 900;
const BUTTONS_DELAY_MS = 1400;

export function Done() {
  const { caseId = "" } = useParams();
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8 pt-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <SuccessCheck />
        <h1
          style={{ animationDelay: `${TITLE_DELAY_MS}ms` }}
          className={`${REVEAL_CLASS} whitespace-pre-line break-keep text-xl font-bold text-ink`}
        >
          {"이의제기신청서 초안을 모두 작성해서\nPDF를 저장했어요."}
        </h1>
      </div>
      <div
        style={{ animationDelay: `${CARD_DELAY_MS}ms` }}
        className={`${REVEAL_CLASS} w-full`}
      >
        <GuideSubmitInfo />
      </div>
      <div
        style={{ animationDelay: `${BUTTONS_DELAY_MS}ms` }}
        className={`${REVEAL_CLASS} flex w-full flex-col items-center gap-3`}
      >
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

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { GradientButton } from "@/components/common/GradientButton";
import { getEvidencePath, NEW_CASE_PATH } from "@/lib/casePaths";
import { ensureTrialCase } from "@/lib/trialCases";
import { useSessionStore } from "@/store/sessionStore";

export function HomeStartButton() {
  const navigate = useNavigate();
  const trialScenario = useSessionStore((state) => state.trialScenario);
  const prepareTrialCase = useMutation({ mutationFn: ensureTrialCase });

  if (!trialScenario) {
    return (
      <GradientButton fullWidth onClick={() => navigate(NEW_CASE_PATH)}>
        이의제기 준비 시작
      </GradientButton>
    );
  }

  const handleContinue = async () => {
    const caseId = await prepareTrialCase.mutateAsync(trialScenario);
    navigate(getEvidencePath(caseId));
  };

  return (
    <div className="flex flex-col gap-2">
      <GradientButton
        fullWidth
        disabled={prepareTrialCase.isPending}
        onClick={() => handleContinue().catch(() => undefined)}
      >
        {prepareTrialCase.isPending
          ? "사건을 준비하는 중…"
          : "내 사건 이어서 하기"}
      </GradientButton>
      {prepareTrialCase.error && (
        <p role="alert" className="text-center text-sm text-danger">
          {prepareTrialCase.error.message}
        </p>
      )}
    </div>
  );
}

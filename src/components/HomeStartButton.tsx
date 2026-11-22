import { useNavigate } from "react-router-dom";

import { GradientButton } from "@/components/common/GradientButton";
import { getEvidencePath, NEW_CASE_PATH } from "@/lib/casePaths";
import { findLatestSampleCase, readStoredCases } from "@/lib/caseStorage";
import { useSessionStore } from "@/store/sessionStore";

export function HomeStartButton() {
  const navigate = useNavigate();
  const trialScenario = useSessionStore((state) => state.trialScenario);

  if (!trialScenario) {
    return (
      <GradientButton fullWidth onClick={() => navigate(NEW_CASE_PATH)}>
        이의제기 준비 시작
      </GradientButton>
    );
  }

  const trialCase = findLatestSampleCase(readStoredCases(), trialScenario);
  if (!trialCase) {
    return (
      <GradientButton fullWidth onClick={() => navigate("/login")}>
        체험 계정 다시 고르기
      </GradientButton>
    );
  }

  return (
    <GradientButton
      fullWidth
      onClick={() => navigate(getEvidencePath(trialCase.caseId))}
    >
      내 사건 이어서 하기
    </GradientButton>
  );
}

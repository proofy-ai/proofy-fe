import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { getEvidencePath } from "@/lib/casePaths";
import { restartTrialCase } from "@/lib/trialCases";
import type { SampleScenario, StoredCase } from "@/types/api";

type Props = {
  storedCase: StoredCase | null;
  onClose: () => void;
};

export function RestartTrialConfirm({ storedCase, onClose }: Props) {
  const navigate = useNavigate();
  const restart = useMutation({
    mutationFn: ({
      scenario,
      target,
    }: {
      scenario: SampleScenario;
      target: StoredCase;
    }) => restartTrialCase(scenario, target),
    onSuccess: (caseId) => {
      onClose();
      navigate(getEvidencePath(caseId));
    },
  });

  const handleConfirm = () => {
    if (!storedCase?.sampleScenario || restart.isPending) return;
    restart.mutate({ scenario: storedCase.sampleScenario, target: storedCase });
  };

  return (
    <ConfirmModal
      isOpen={!!storedCase}
      message={"처음부터 다시 시작할까요?\n지금까지 한 내용이 지워져요."}
      confirmText={restart.isPending ? "준비하는 중…" : "다시 시작"}
      cancelText="취소"
      onClose={onClose}
      onConfirm={handleConfirm}
    />
  );
}

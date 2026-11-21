import { useState } from "react";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useDeleteCase } from "@/hooks/useDeleteCase";

type Props = {
  caseId: string;
  caseToken: string;
};

export function DeleteCasePanel({ caseId, caseToken }: Props) {
  const { deleteCase, isDeleting } = useDeleteCase(caseId, caseToken);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <button
        type="button"
        disabled={isDeleting}
        onClick={() => setIsConfirmOpen(true)}
        className="text-sm text-ink-sub underline disabled:opacity-50"
      >
        이 사건 지우기
      </button>
      <ConfirmModal
        isOpen={isConfirmOpen}
        message={"이 사건을 삭제할까요?\n삭제하면 되돌릴 수 없어요."}
        confirmText="삭제"
        cancelText="취소"
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          deleteCase();
        }}
      />
    </div>
  );
}

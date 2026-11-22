import { useState } from "react";

import { Button } from "@/components/common/Button";
import { ConfirmModal } from "@/components/common/ConfirmModal";

type Props = {
  unconfirmedCount: number;
  isDisabled: boolean;
  isSaving: boolean;
  onSave: () => void;
  onGoToDraft: () => void;
};

export function ObjectionDownloadButton({
  unconfirmedCount,
  isDisabled,
  isSaving,
  onSave,
  onGoToDraft,
}: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSaveConfirmed = () => {
    setIsConfirmOpen(false);
    onSave();
  };

  const handleCancelToDraft = () => {
    setIsConfirmOpen(false);
    onGoToDraft();
  };

  return (
    <>
      <Button
        fullWidth
        size="md"
        disabled={isDisabled || isSaving}
        onClick={() =>
          unconfirmedCount > 0 ? setIsConfirmOpen(true) : onSave()
        }
      >
        {isSaving ? "PDF 만드는 중…" : "이의제기신청서 PDF 다운로드"}
      </Button>
      <ConfirmModal
        isOpen={isConfirmOpen}
        message={`직접 확인하지 않은 문장이 ${unconfirmedCount}개 있어요.\n확인하고 다운로드할까요?`}
        confirmText="그래도 다운로드"
        cancelText="문장으로 이동"
        onClose={() => setIsConfirmOpen(false)}
        onCancel={handleCancelToDraft}
        onConfirm={handleSaveConfirmed}
      />
    </>
  );
}

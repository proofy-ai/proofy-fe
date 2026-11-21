import { ConfirmModal } from "@/components/common/ConfirmModal";

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function OverwriteDraftConfirm({ isOpen, onConfirm, onClose }: Props) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      message={
        "다시 분석하면 직접 고친 초안이 덮어써져요.\n그래도 다시 분석할까요?"
      }
      confirmText="다시 분석"
      cancelText="취소"
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}

import type { ReactNode } from "react";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = "예",
  cancelText = "아니요",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
      <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
        <div className="text-center text-ink mb-6 leading-relaxed whitespace-pre-line">
          {message}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#E0E0E0] text-ink-sub rounded-lg font-medium transition-colors hover:bg-[#D2D2D2]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-brand text-white rounded-lg font-medium transition-colors hover:bg-brand-strong"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

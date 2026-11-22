import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
};

export function ConfirmModal({
  isOpen,
  onClose,
  onCancel = onClose,
  onConfirm,
  message,
  confirmText = "예",
  cancelText = "아니요",
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const buttons = dialog?.querySelectorAll("button") ?? [];
    buttons[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onClose();
      if (event.key !== "Tab" || buttons.length === 0) return;

      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full"
      >
        <div className="text-center text-ink mb-6 leading-relaxed whitespace-pre-line">
          {message}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-[#E0E0E0] text-ink-sub rounded-lg font-medium transition-colors hover:bg-[#D2D2D2]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-brand-strong text-white rounded-lg font-medium transition-colors hover:bg-brand"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

import { LogOut } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useSessionStore } from "@/store/sessionStore";

type Props = {
  className: string;
};

export function AccountSwitchButton({ className }: Props) {
  const navigate = useNavigate();
  const leave = useSessionStore((state) => state.leave);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSwitchConfirmed = () => {
    setIsConfirmOpen(false);
    leave();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <button
        type="button"
        aria-label="계정 바꾸기"
        className={className}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        onClick={() => setIsConfirmOpen(true)}
      >
        <LogOut size={20} className="text-ink" />
        <span className="hidden text-sm font-medium text-ink md:inline">
          계정 바꾸기
        </span>
      </button>
      {createPortal(
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleSwitchConfirmed}
          message={
            <>
              다른 체험 계정으로 바꿀까요?
              <br />
              만든 사건은 내 사건에 남아 있어요.
            </>
          }
          confirmText="바꾸기"
          cancelText="취소"
        />,
        document.body,
      )}
    </>
  );
}

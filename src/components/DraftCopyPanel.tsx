import { useState } from "react";

import { Button } from "@/components/common/Button";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { GlassCard } from "@/components/common/GlassCard";
import { useToastStore } from "@/store/toastStore";
import type { Draft } from "@/types/api";

type Props = {
  draft: Draft;
  onGoToDraft: () => void;
};

export function DraftCopyPanel({ draft, onGoToDraft }: Props) {
  const showToast = useToastStore((state) => state.show);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const copyDraft = async () => {
    setIsConfirmOpen(false);
    try {
      await navigator.clipboard.writeText(draft.fullText);
      showToast("초안을 복사했어요", "success");
    } catch {
      showToast(
        "복사하지 못했어요. 글을 직접 선택해서 복사해 주세요.",
        "error",
      );
    }
  };

  const handleCopyClick = () =>
    draft.unconfirmedCount > 0 ? setIsConfirmOpen(true) : copyDraft();

  return (
    <GlassCard title="소명서 초안">
      <div className="flex w-full flex-col gap-3">
        <p className="whitespace-pre-line break-keep rounded-xl bg-white/70 p-4 text-ink">
          {draft.fullText}
        </p>
        <Button fullWidth size="md" onClick={handleCopyClick}>
          초안 복사
        </Button>
      </div>
      <ConfirmModal
        isOpen={isConfirmOpen}
        message={`아직 확인하지 않은 문장이 ${draft.unconfirmedCount}개 있어요.\n사실과 다른 내용을 내면 처벌받을 수 있습니다(법 제16조).`}
        confirmText="그래도 복사"
        cancelText="문장으로 이동"
        onClose={() => setIsConfirmOpen(false)}
        onCancel={() => {
          setIsConfirmOpen(false);
          onGoToDraft();
        }}
        onConfirm={copyDraft}
      />
    </GlassCard>
  );
}

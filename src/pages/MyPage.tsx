import { useState } from "react";

import { CaseCard } from "@/components/CaseCard";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { EmptyState, ErrorState, LoadingState } from "@/components/StateViews";
import { useMyCases } from "@/hooks/useMyCases";
import type { StoredCase } from "@/types/api";

const DELETE_CONFIRM_MESSAGE =
  "이 사건을 삭제할까요? 올린 서류와 분석 결과도 함께 지워져요.";

export function MyPage() {
  const { cases, removedCount, deleteMyCase, isDeleting } = useMyCases();
  const [caseToDelete, setCaseToDelete] = useState<StoredCase | null>(null);

  const handleDeleteConfirm = () => {
    if (!caseToDelete || isDeleting) return;
    deleteMyCase(caseToDelete);
    setCaseToDelete(null);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">내 사건</h1>

      {removedCount > 0 && (
        <p
          role="status"
          className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-ink"
        >
          만료된 사건을 정리했어요
        </p>
      )}

      {cases.length === 0 && (
        <EmptyState
          title="진행 중인 사건이 없어요"
          description="이의제기 준비를 시작하면 여기에 사건이 보여요."
        />
      )}

      {cases.map(({ storedCase, query }) => {
        if (query.isPending) return <LoadingState key={storedCase.caseId} />;
        if (query.isError) {
          return (
            <ErrorState
              key={storedCase.caseId}
              message={query.error.message}
              onRetry={() => query.refetch()}
            />
          );
        }
        return (
          <CaseCard
            key={storedCase.caseId}
            detail={query.data.case}
            onDeleteClick={() => setCaseToDelete(storedCase)}
          />
        );
      })}

      <ConfirmModal
        isOpen={!!caseToDelete}
        message={DELETE_CONFIRM_MESSAGE}
        confirmText="삭제"
        cancelText="취소"
        onClose={() => setCaseToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

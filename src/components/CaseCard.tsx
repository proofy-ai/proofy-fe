import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { GlassCard } from "@/components/common/GlassCard";
import { DeadlineBadge } from "@/components/DeadlineBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { getCaseProgress, INFLOW_TYPE_LABELS } from "@/lib/caseLabels";
import { getContinuePath } from "@/lib/casePaths";
import { formatCaseNumber } from "@/lib/koreaDate";
import type { CaseDetail } from "@/types/api";

type Props = {
  detail: CaseDetail;
  onDeleteClick: () => void;
  onRestartClick?: () => void;
};

export function CaseCard({ detail, onDeleteClick, onRestartClick }: Props) {
  const progress = getCaseProgress(detail.hasResult);

  return (
    <GlassCard>
      <div className="flex w-full flex-col gap-3">
        <p className="text-lg font-bold text-ink">
          사건 {formatCaseNumber(detail.createdAt)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink-sub">현재 단계</span>
          <StatusBadge tone={progress.tone}>{progress.label}</StatusBadge>
          <StatusBadge tone="info">
            {INFLOW_TYPE_LABELS[detail.inflow.type]}
          </StatusBadge>
          {detail.isSample && (
            <StatusBadge tone="neutral">체험 계정</StatusBadge>
          )}
          <span className="ml-auto">
            <DeadlineBadge deadline={detail.deadline} />
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={getContinuePath(detail)}
            className="rounded-full bg-brand-strong px-4 py-1.5 text-sm font-medium text-white transition-all duration-300 ease-smooth hover:scale-[1.03] hover:bg-brand active:scale-[0.97]"
          >
            이어서 하기
          </Link>
          {onRestartClick && (
            <button
              type="button"
              onClick={onRestartClick}
              className="rounded-full bg-gray-200 px-4 py-1.5 text-sm font-medium text-ink transition-all duration-300 ease-smooth hover:scale-[1.03] hover:bg-gray-300 active:scale-[0.97]"
            >
              처음부터 다시
            </button>
          )}
          <button
            type="button"
            aria-label="사건 삭제"
            onClick={onDeleteClick}
            className="ml-auto rounded-full p-2 text-ink-sub transition-colors hover:bg-white/70 hover:text-danger"
          >
            <Trash2 className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

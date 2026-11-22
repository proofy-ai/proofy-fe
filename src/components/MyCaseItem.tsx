import type { UseQueryResult } from "@tanstack/react-query";

import { CaseCard } from "@/components/CaseCard";
import { ErrorState, LoadingState } from "@/components/StateViews";
import type { CaseResponse } from "@/types/api";

type Props = {
  query: UseQueryResult<CaseResponse>;
  onDeleteClick: () => void;
  onRestartClick?: () => void;
};

export function MyCaseItem({ query, onDeleteClick, onRestartClick }: Props) {
  if (query.isPending) return <LoadingState />;
  if (query.isError) {
    return (
      <ErrorState
        message={query.error.message}
        onRetry={() => query.refetch()}
      />
    );
  }
  return (
    <CaseCard
      detail={query.data.case}
      onDeleteClick={onDeleteClick}
      onRestartClick={onRestartClick}
    />
  );
}

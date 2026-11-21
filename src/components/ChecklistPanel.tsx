import type { UseQueryResult } from "@tanstack/react-query";

import { ChecklistSection } from "@/components/ChecklistSection";
import { ChecklistUploadButton } from "@/components/ChecklistUploadButton";
import { GlassCard } from "@/components/common/GlassCard";
import { ErrorState, LoadingState } from "@/components/StateViews";
import type { Checklist, DocType } from "@/types/api";

type Props = {
  checklistQuery: UseQueryResult<Checklist, Error>;
  onUploadClick: (docType: DocType) => void;
};

export function ChecklistPanel({ checklistQuery, onUploadClick }: Props) {
  return (
    <GlassCard title="필요한 서류">
      {checklistQuery.isPending && <LoadingState />}
      {checklistQuery.isError && (
        <ErrorState
          message={checklistQuery.error.message}
          onRetry={() => checklistQuery.refetch()}
        />
      )}
      {checklistQuery.data && (
        <ChecklistSection
          checklist={checklistQuery.data}
          renderAction={(item) => (
            <ChecklistUploadButton item={item} onUploadClick={onUploadClick} />
          )}
        />
      )}
    </GlassCard>
  );
}

import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { EmptyState } from "@/components/StateViews";
import { readStoredCases } from "@/lib/caseStorage";
import type { StoredCase } from "@/types/api";

type Props = {
  caseId: string;
  children: (storedCase: StoredCase) => ReactNode;
};

export function StoredCaseGuard({ caseId, children }: Props) {
  const storedCase = readStoredCases().find(
    (storedItem) => storedItem.caseId === caseId,
  );

  if (!storedCase) {
    return (
      <EmptyState
        title="사건을 찾을 수 없어요"
        description="이 브라우저에 저장된 사건이 아니에요."
        action={
          <Link to="/me" className="text-sm font-medium text-ink underline">
            내 사건으로 가기
          </Link>
        }
      />
    );
  }

  return children(storedCase);
}

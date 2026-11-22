import { Link } from "react-router-dom";

import { EmptyState, ErrorState } from "@/components/StateViews";
import { isCaseGone } from "@/hooks/useMyCases";

type Props = {
  error: Error;
  onRetry: () => void;
};

export function CaseErrorState({ error, onRetry }: Props) {
  if (!isCaseGone(error)) {
    return <ErrorState message={error.message} onRetry={onRetry} />;
  }

  return (
    <EmptyState
      title={error.message}
      action={
        <Link to="/" className="text-sm font-medium text-ink underline">
          처음으로 돌아가기
        </Link>
      }
    />
  );
}

import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <Inbox className="h-8 w-8 text-ink-mark" aria-hidden />
      <p className="break-keep font-medium text-ink">{title}</p>
      {description && (
        <p className="break-keep text-sm text-ink-sub">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 px-4 py-10 text-center"
    >
      <AlertCircle className="h-8 w-8 text-danger" aria-hidden />
      <p className="whitespace-pre-line break-keep text-ink">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-full bg-brand-strong px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({
  label = "불러오는 중이에요",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-2 px-4 py-10 text-center"
    >
      <Loader2 className="h-8 w-8 animate-spin text-brand" aria-hidden />
      <p className="text-sm text-ink-sub">{label}</p>
    </div>
  );
}

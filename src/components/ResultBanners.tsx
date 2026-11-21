import { Button } from "@/components/common/Button";

type Props = {
  isStale: boolean;
  precomputed: boolean;
  isReanalyzing: boolean;
  errorMessage: string | null;
  onReanalyze: () => void;
};

export function ResultBanners({
  isStale,
  precomputed,
  isReanalyzing,
  errorMessage,
  onReanalyze,
}: Props) {
  if (!isStale && !precomputed) return null;

  return (
    <div className="flex flex-col gap-2">
      {precomputed && (
        <p className="break-keep rounded-xl bg-brand-soft px-4 py-3 text-sm text-ink">
          미리 만들어 둔 결과를 보여 드리고 있어요.
        </p>
      )}
      {isStale && (
        <div className="flex flex-col gap-2 rounded-xl bg-warning-soft px-4 py-3">
          <p className="break-keep text-sm text-ink">
            내 상황이나 서류가 바뀌어서 이 결과가 최신이 아닐 수 있어요.
          </p>
          {errorMessage && (
            <p role="alert" className="whitespace-pre-line text-sm text-danger">
              {errorMessage}
            </p>
          )}
          <div>
            <Button disabled={isReanalyzing} onClick={onReanalyze}>
              다시 분석하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

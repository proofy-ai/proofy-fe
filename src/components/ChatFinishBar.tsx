import { GradientButton } from "@/components/common/GradientButton";

type Props = {
  hasAnswers: boolean;
  isPending: boolean;
  errorMessage: string | null;
  onFinish: () => void;
};

export function ChatFinishBar({
  hasAnswers,
  isPending,
  errorMessage,
  onFinish,
}: Props) {
  return (
    <>
      {errorMessage && (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}
      <GradientButton fullWidth disabled={isPending} onClick={onFinish}>
        {hasAnswers ? "다시 분석하기" : "결과 보기"}
      </GradientButton>
    </>
  );
}

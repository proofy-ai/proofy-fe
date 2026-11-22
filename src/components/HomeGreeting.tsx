import { HelperDog } from "@/components/HelperDog";

const GREETING_MESSAGE =
  "안녕하세요, AI 프루피예요.\n이의제기에 필요한 서류 준비를 도와드려요.\n증빙을 올리면 AI가 읽고 정리해서 소명서 초안과 부족한 서류를 알려 줘요.";

export function HomeGreeting() {
  return (
    <div className="mb-4 flex items-center gap-3">
      <HelperDog />
      <div className="relative min-w-0 flex-1">
        <span
          aria-hidden
          className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 rounded-sm bg-brand-tint"
        />
        <p className="relative whitespace-pre-line break-keep rounded-2xl bg-brand-tint px-4 py-3 text-sm leading-relaxed text-ink">
          {GREETING_MESSAGE}
        </p>
      </div>
    </div>
  );
}

import { EmptyState } from "@/components/StateViews";

export default function MyPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">내 사건</h1>
      <EmptyState
        title="진행 중인 사건이 없어요"
        description="이의제기 준비를 시작하면 여기에 사건이 보여요."
      />
    </div>
  );
}

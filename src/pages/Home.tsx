import { Link, useNavigate } from "react-router-dom";

import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { StatusBadge } from "@/components/StatusBadge";
import { NEW_CASE_PATH } from "@/lib/casePaths";
import { readStoredCases } from "@/lib/caseStorage";

const steps = [
  { label: "지급정지", isHelped: false },
  { label: "채권소멸절차 공고", isHelped: false },
  { label: "이의제기 (공고일 기준 2개월 이내)", isHelped: true },
  { label: "심사 (원칙 5영업일)", isHelped: false },
  { label: "결과", isHelped: false },
];

const documents = [
  {
    title: "이의제기신청서",
    description: "별지 제4호서식. 은행 창구·양식으로 작성해요.",
  },
  {
    title: "소명자료",
    description: "사기이용계좌가 아니라는 사실을 보여 주는 자료예요.",
  },
  {
    title: "신분증 사본",
    description: "이 서비스는 받지 않아요. 은행에 낼 때 직접 첨부하세요.",
  },
];

export function Home() {
  const navigate = useNavigate();
  const storedCaseCount = readStoredCases().length;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <GlassCard title="내 계좌가 지급정지됐나요?">
        <p className="mb-4 text-gray-600">
          이의제기에 필요한 서류 준비를 도와드려요. 증빙을 올리면 AI가 읽고
          정리해서 소명서 초안과 부족한 서류를 알려 줘요.
        </p>
        <GradientButton fullWidth onClick={() => navigate(NEW_CASE_PATH)}>
          이의제기 준비 시작
        </GradientButton>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-ink-sub">
          {storedCaseCount > 0 && (
            <Link to="/me" className="underline">
              내 사건 {storedCaseCount}건 이어서 하기
            </Link>
          )}
          <Link to="/login" className="underline">
            샘플로 체험하기
          </Link>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          시연용 서비스이며 예시는 합성 데이터입니다.
        </p>
      </GlassCard>

      <GlassCard title="절차 한눈에">
        <ol className="flex flex-col gap-1">
          {steps.map((step, index) => (
            <li
              key={step.label}
              className={`flex items-center gap-3 rounded-xl px-2 py-1.5 ${
                step.isHelped ? "bg-brand-soft" : ""
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
                  step.isHelped ? "bg-brand" : "bg-brand-light"
                }`}
              >
                {index + 1}
              </span>
              <span className={step.isHelped ? "font-semibold text-ink" : ""}>
                {step.label}
              </span>
              {step.isHelped && (
                <span className="ml-auto shrink-0">
                  <StatusBadge tone="info">Proofy가 도와요</StatusBadge>
                </span>
              )}
            </li>
          ))}
        </ol>
      </GlassCard>

      <GlassCard title="필요한 서류">
        <div className="flex flex-col gap-4">
          {documents.map((document) => (
            <div key={document.title}>
              <p className="font-semibold">{document.title}</p>
              <p className="text-gray-600">{document.description}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <p className="text-sm text-gray-500">
        AI는 해제 여부를 판정하지 않고 서류 준비만 돕습니다. 사실과 다른 내용을
        내는 거짓 이의제기는 처벌받을 수 있어요.
      </p>
    </div>
  );
}

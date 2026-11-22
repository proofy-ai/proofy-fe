import { Link } from "react-router-dom";

import { GlassCard } from "@/components/common/GlassCard";
import { HelperDog } from "@/components/HelperDog";
import { HomeStartButton } from "@/components/HomeStartButton";
import { ProcedureSteps } from "@/components/ProcedureSteps";
import { RequiredDocuments } from "@/components/RequiredDocuments";
import { filterCasesForSession, readStoredCases } from "@/lib/caseStorage";
import { useSessionStore } from "@/store/sessionStore";

export function Home() {
  const trialScenario = useSessionStore((state) => state.trialScenario);
  const isTrialAccount = trialScenario !== null;
  const storedCaseCount = filterCasesForSession(
    readStoredCases(),
    trialScenario,
  ).length;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <GlassCard title="내 계좌가 지급정지됐나요?" titleClassName="text-lg">
        <div className="mb-4 flex items-center gap-4">
          <HelperDog />
          <p className="whitespace-pre-line break-keep text-gray-600">
            {
              "안녕하세요, AI 프루피예요.\n이의제기에 필요한 서류 준비를 도와드려요.\n증빙을 올리면 AI가 읽고 정리해서 소명서 초안과 부족한 서류를 알려 줘요."
            }
          </p>
        </div>
        <HomeStartButton />
        {!isTrialAccount && storedCaseCount > 0 && (
          <div className="mt-3 flex justify-center text-sm font-medium text-ink">
            <Link to="/me" className="underline">
              내 사건 {storedCaseCount}건 이어서 하기
            </Link>
          </div>
        )}
      </GlassCard>

      <GlassCard title="절차 한눈에">
        <ProcedureSteps />
      </GlassCard>

      <GlassCard title="필요한 서류">
        <RequiredDocuments />
      </GlassCard>
    </div>
  );
}

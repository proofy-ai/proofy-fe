import { Link } from "react-router-dom";

import { GlassCard } from "@/components/common/GlassCard";
import { HomeGreeting } from "@/components/HomeGreeting";
import { HomeStartButton } from "@/components/HomeStartButton";
import { ProcedureSteps } from "@/components/ProcedureSteps";
import { RequiredDocuments } from "@/components/RequiredDocuments";
import { filterCasesForSession, readStoredCases } from "@/lib/caseStorage";
import { useSessionStore } from "@/store/sessionStore";

const REVEAL_CLASS = "animate-bubble-in motion-reduce:animate-none";
const CARD_STAGGER_MS = 250;
const PROCEDURE_CARD_INDEX = 1;

const getRevealDelay = (cardIndex: number) => ({
  animationDelay: `${cardIndex * CARD_STAGGER_MS}ms`,
});

export function Home() {
  const trialScenario = useSessionStore((state) => state.trialScenario);
  const isTrialAccount = trialScenario !== null;
  const storedCaseCount = filterCasesForSession(
    readStoredCases(),
    trialScenario,
  ).length;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div style={getRevealDelay(0)} className={REVEAL_CLASS}>
        <GlassCard title="내 계좌가 지급정지됐나요?" titleClassName="text-lg">
          <HomeGreeting />
          <HomeStartButton />
          {!isTrialAccount && storedCaseCount > 0 && (
            <div className="mt-3 flex justify-center text-sm font-medium text-ink">
              <Link to="/me" className="underline">
                내 사건 {storedCaseCount}건 이어서 하기
              </Link>
            </div>
          )}
        </GlassCard>
      </div>

      <div
        style={getRevealDelay(PROCEDURE_CARD_INDEX)}
        className={REVEAL_CLASS}
      >
        <GlassCard title="절차 한눈에">
          <ProcedureSteps
            baseDelayMs={PROCEDURE_CARD_INDEX * CARD_STAGGER_MS + 300}
          />
        </GlassCard>
      </div>

      <div style={getRevealDelay(2)} className={REVEAL_CLASS}>
        <GlassCard title="필요한 서류">
          <RequiredDocuments />
        </GlassCard>
      </div>
    </div>
  );
}

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createSampleCase } from "@/api/cases";
import { ApiError } from "@/api/client";
import { GlassCard } from "@/components/common/GlassCard";
import { GradientButton } from "@/components/common/GradientButton";
import { Logo } from "@/components/Logo";
import { StatusBadge } from "@/components/StatusBadge";
import { addStoredCase } from "@/lib/caseStorage";
import { useSessionStore } from "@/store/sessionStore";
import type { SampleScenario } from "@/types/api";

type TrialAccount = {
  accountName: string;
  scenario: SampleScenario;
  situationLabel: string;
  profile: string;
  quote: string;
};

const trialAccounts: TrialAccount[] = [
  {
    accountName: "test01",
    scenario: "GOODS",
    situationLabel: "물품 거래",
    profile: "온라인으로 소품을 파는 청년 개인사업자(가상)",
    quote: "물건값으로 받은 돈 때문에 계좌가 묶였어요",
  },
  {
    accountName: "test02",
    scenario: "UNEXPECTED",
    situationLabel: "모르는 입금",
    profile: "사회초년생(가상)",
    quote: "모르는 돈이 들어온 뒤 계좌가 묶였어요(통장 묶기)",
  },
];

const DEMO_NOTICE = "시연용 서비스예요 · 합성 데이터만 사용해요";

const passwordMaskLength = 8;
const typingIntervalMs = 60;

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function Login() {
  const navigate = useNavigate();
  const enter = useSessionStore((state) => state.enter);
  const createSample = useMutation({ mutationFn: createSampleCase });
  const [selectedAccount, setSelectedAccount] = useState<TrialAccount | null>(
    null,
  );
  const [typedIdLength, setTypedIdLength] = useState(0);
  const [typedPasswordLength, setTypedPasswordLength] = useState(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function typeInto(setLength: (length: number) => void, total: number) {
    for (let length = 1; length <= total; length++) {
      setLength(length);
      await wait(typingIntervalMs);
    }
  }

  async function handleAccountSelect(account: TrialAccount) {
    if (isLoggingIn) return;
    createSample.reset();
    setSelectedAccount(account);
    setTypedIdLength(0);
    setTypedPasswordLength(0);
    setIsLoggingIn(true);

    await typeInto(setTypedIdLength, account.accountName.length);
    await typeInto(setTypedPasswordLength, passwordMaskLength);

    try {
      const created = await createSample.mutateAsync(account.scenario);
      addStoredCase({
        caseId: created.caseId,
        caseToken: created.caseToken,
        createdAt: created.case.createdAt,
        sampleScenario: account.scenario,
      });
      enter();
      navigate("/");
    } catch {
      setIsLoggingIn(false);
    }
  }

  const loginError =
    createSample.error instanceof ApiError ? createSample.error.message : null;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8">
      <div className="flex flex-col items-center gap-3 pt-2">
        <Logo className="h-12" />
        <h1 className="text-2xl font-bold text-ink">로그인</h1>
      </div>

      <GlassCard>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-1 text-sm font-medium text-ink">
            아이디
            <input
              readOnly
              aria-label="아이디"
              value={selectedAccount?.accountName.slice(0, typedIdLength) ?? ""}
              placeholder="아래에서 체험 계정을 골라 주세요"
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              className="cursor-not-allowed select-none rounded-xl border border-brand-line bg-white/80 px-4 py-3 text-base text-ink placeholder:text-ink-mark"
            />
          </div>
          <div className="flex flex-col gap-1 text-sm font-medium text-ink">
            비밀번호
            <input
              readOnly
              aria-label="비밀번호"
              type="password"
              value={"•".repeat(typedPasswordLength)}
              placeholder="체험 계정은 비밀번호가 필요 없어요"
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              className="cursor-not-allowed select-none rounded-xl border border-brand-line bg-white/80 px-4 py-3 text-base text-ink placeholder:text-ink-mark"
            />
          </div>
          <GradientButton fullWidth disabled>
            {createSample.isPending ? "로그인 중…" : "로그인"}
          </GradientButton>
          {loginError && (
            <p role="alert" className="whitespace-pre-line text-sm text-danger">
              {loginError}
            </p>
          )}
        </form>
      </GlassCard>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">체험 계정</h2>
          <p className="break-keep text-base text-ink-sub">
            하나를 선택해서 누르면 로그인 정보가 채워져요
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {trialAccounts.map((account) => (
            <button
              key={account.scenario}
              type="button"
              disabled={isLoggingIn}
              onClick={() => handleAccountSelect(account)}
              className={`rounded-3xl text-left transition-[transform,box-shadow] duration-300 ease-smooth will-change-transform disabled:cursor-not-allowed enabled:hover:-translate-y-0.5 enabled:hover:shadow-md ${
                selectedAccount?.scenario === account.scenario
                  ? "ring-2 ring-brand"
                  : "disabled:opacity-60"
              }`}
            >
              <GlassCard title={account.accountName}>
                <div className="flex w-full flex-col gap-2">
                  <div>
                    <StatusBadge tone="info">
                      {account.situationLabel}
                    </StatusBadge>
                  </div>
                  <p className="break-keep font-medium text-ink">
                    {account.profile}
                  </p>
                  <p className="break-keep text-ink-sub">“{account.quote}”</p>
                </div>
              </GlassCard>
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-col items-center gap-2 pb-4 text-center">
        <p className="break-keep text-sm text-ink-sub">
          내 서류로 직접 해 보고 싶다면
        </p>
        <button
          type="button"
          disabled={isLoggingIn}
          onClick={() => {
            enter();
            navigate("/");
          }}
          className="rounded-full border border-brand-line bg-white/70 px-5 py-2 text-sm font-medium text-ink transition-colors enabled:hover:bg-brand-soft disabled:opacity-60"
        >
          직접 해 보기
        </button>
      </div>

      <p className="pb-4 text-center text-xs text-ink-faint">{DEMO_NOTICE}</p>
    </div>
  );
}

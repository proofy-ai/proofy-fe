import { GlassCard } from "@/components/common/GlassCard";
import type { Referral } from "@/types/api";

type Props = {
  referral: Referral;
};

export function ReferralCard({ referral }: Props) {
  return (
    <GlassCard title="먼저 법률 상담을 받아 보세요">
      <div className="flex w-full flex-col gap-4">
        <p className="break-keep text-ink">{referral.message}</p>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-ink-sub">
            이렇게 쓰신 부분이 있어요
          </p>
          <ul className="flex flex-wrap gap-2">
            {referral.matchedPhrases.map((phrase) => (
              <li
                key={phrase}
                className="rounded-full bg-warning-soft px-3 py-1 text-sm text-warning"
              >
                {phrase}
              </li>
            ))}
          </ul>
        </div>
        <ul className="flex flex-col gap-2">
          {referral.contacts.map((contact) => (
            <li
              key={contact.name}
              className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3"
            >
              <span className="font-medium text-ink">{contact.name}</span>
              <a
                href={`tel:${contact.phone}`}
                className="font-bold text-brand-strong underline"
              >
                {contact.phone}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}

import type { ReactNode } from "react";

import dogFace from "@/assets/img/brand/dog-face.webp";
import { useSettingStore } from "@/store/settingStore";

const DARK_MODE_IMAGE_FIX = "[filter:invert(1)_hue-rotate(180deg)]";

type PruppyBubbleProps = {
  children: ReactNode;
  tone?: "white" | "tint";
};

export function PruppyBubble({ children, tone = "white" }: PruppyBubbleProps) {
  const darkMode = useSettingStore((state) => state.darkMode);

  return (
    <div className="flex animate-bubble-in items-start gap-2 motion-reduce:animate-none">
      <img
        src={dogFace}
        alt=""
        className={`h-9 w-9 shrink-0 rounded-full bg-brand-soft object-cover ${
          darkMode ? DARK_MODE_IMAGE_FIX : ""
        }`}
      />
      <p
        className={`max-w-[85%] break-keep rounded-2xl rounded-tl-sm px-4 py-2.5 text-ink ${
          tone === "white" ? "bg-white shadow-sm" : "bg-brand-tint"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

export function TypingBubble() {
  return (
    <PruppyBubble>
      <span className="inline-flex items-center gap-1" aria-label="입력 중">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            style={{ animationDelay: `${index * 160}ms` }}
            className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-ink-faint motion-reduce:animate-none"
          />
        ))}
      </span>
    </PruppyBubble>
  );
}

export function UserBubble({ answer }: { answer: string | null }) {
  return (
    <div className="flex animate-bubble-in justify-end motion-reduce:animate-none">
      <p
        className={`max-w-[80%] whitespace-pre-line break-keep rounded-2xl rounded-tr-sm px-4 py-2.5 ${
          answer ? "bg-brand-strong text-white" : "bg-gray-200 text-ink-sub"
        }`}
      >
        {answer ?? "질문을 넘길게요"}
      </p>
    </div>
  );
}

import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { GlassCard } from "@/components/common/GlassCard";
import { Toggle } from "@/components/common/Toggle";
import { useSessionStore } from "@/store/sessionStore";
import { useSettingStore } from "@/store/settingStore";

export function Settings() {
  const navigate = useNavigate();
  const leave = useSessionStore((state) => state.leave);
  const largeTextMode = useSettingStore((state) => state.largeTextMode);
  const setLargeTextMode = useSettingStore((state) => state.setLargeTextMode);
  const darkMode = useSettingStore((state) => state.darkMode);
  const setDarkMode = useSettingStore((state) => state.setDarkMode);

  function handleLogout() {
    leave();
    navigate("/login", { replace: true });
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink">설정</h1>
      <GlassCard title="화면">
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between">
            <span id="large-text-label">큰글씨 모드</span>
            <Toggle
              checked={largeTextMode}
              onChange={setLargeTextMode}
              aria-labelledby="large-text-label"
            />
          </div>
          <div className="flex items-center justify-between">
            <span id="dark-mode-label">다크 모드</span>
            <Toggle
              checked={darkMode}
              onChange={setDarkMode}
              aria-labelledby="dark-mode-label"
            />
          </div>
        </div>
      </GlassCard>
      <GlassCard title="계정">
        <div className="flex w-full items-center justify-between gap-4">
          <p className="break-keep text-sm text-ink-sub">
            로그아웃하면 로그인 화면으로 돌아가요. 만든 사건은 내 사건에 남아
            있어요.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-2 rounded-full border border-brand-line bg-white/70 px-4 py-1.5 text-sm font-medium text-ink transition-all duration-300 ease-smooth hover:scale-[1.03] hover:bg-brand-soft"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            로그아웃
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

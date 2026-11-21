import GlassCard from "@/components/common/GlassCard";
import Toggle from "@/components/common/Toggle";
import { useSettingStore } from "@/store/settingStore";

export default function MyPage() {
  const largeTextMode = useSettingStore((state) => state.largeTextMode);
  const setLargeTextMode = useSettingStore((state) => state.setLargeTextMode);
  const darkMode = useSettingStore((state) => state.darkMode);
  const setDarkMode = useSettingStore((state) => state.setDarkMode);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#333333]">내 사건</h1>
      <GlassCard title="설정">
        <div className="flex flex-col gap-4">
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
    </div>
  );
}

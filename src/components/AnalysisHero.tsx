import dogReading from "@/assets/img/brand/dog-reading.webp";
import { useSettingStore } from "@/store/settingStore";

const DARK_MODE_IMAGE_FIX = "[filter:invert(1)_hue-rotate(180deg)]";

export function AnalysisHero() {
  const darkMode = useSettingStore((state) => state.darkMode);

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <img
        src={dogReading}
        alt=""
        className={`h-36 w-36 ${darkMode ? DARK_MODE_IMAGE_FIX : ""}`}
      />
      <h1 className="break-keep text-xl font-bold text-ink">
        프루피 AI가 자료를 분석하고 있어요
      </h1>
      <p className="break-keep text-sm text-ink-sub">
        1분 정도 걸려요 · 화면을 닫아도 내 사건에서 확인할 수 있어요
      </p>
    </div>
  );
}

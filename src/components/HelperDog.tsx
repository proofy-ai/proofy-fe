import dogWave from "@/assets/img/brand/dog-wave.webp";
import { useSettingStore } from "@/store/settingStore";

const DARK_MODE_IMAGE_FIX = "[filter:invert(1)_hue-rotate(180deg)]";

export function HelperDog() {
  const darkMode = useSettingStore((state) => state.darkMode);

  return (
    <img
      src={dogWave}
      alt=""
      className={`h-28 w-auto shrink-0 sm:h-32 ${darkMode ? DARK_MODE_IMAGE_FIX : ""}`}
    />
  );
}

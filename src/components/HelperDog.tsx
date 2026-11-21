import dogSit from "@/assets/img/brand/dog-sit.png";
import { useSettingStore } from "@/store/settingStore";

const DARK_MODE_IMAGE_FIX = "[filter:invert(1)_hue-rotate(180deg)]";

export function HelperDog() {
  const darkMode = useSettingStore((state) => state.darkMode);

  return (
    <img
      src={dogSit}
      alt=""
      className={`h-24 w-auto shrink-0 sm:h-28 ${darkMode ? DARK_MODE_IMAGE_FIX : ""}`}
    />
  );
}

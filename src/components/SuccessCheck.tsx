import checkDog from "@/assets/img/brand/check-dog.webp";
import { useSettingStore } from "@/store/settingStore";

const DARK_MODE_IMAGE_FIX = "[filter:invert(1)_hue-rotate(180deg)]";

export function SuccessCheck() {
  const darkMode = useSettingStore((state) => state.darkMode);

  return (
    <img
      src={checkDog}
      alt=""
      className={`h-52 w-52 animate-success-pop motion-reduce:animate-none ${
        darkMode ? DARK_MODE_IMAGE_FIX : ""
      }`}
    />
  );
}

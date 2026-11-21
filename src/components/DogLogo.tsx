import dogGrey from "@/assets/img/brand/logo-dog-grey.png";
import dogSilver from "@/assets/img/brand/logo-dog-silver.png";
import { useSettingStore } from "@/store/settingStore";

const DARK_MODE_IMAGE_FIX = "[filter:invert(1)_hue-rotate(180deg)]";

type DogLogoProps = {
  className?: string;
};

export function DogLogo({ className = "h-32" }: DogLogoProps) {
  const darkMode = useSettingStore((state) => state.darkMode);

  return (
    <img
      src={darkMode ? dogSilver : dogGrey}
      alt="Proofy"
      className={`w-auto ${className} ${darkMode ? DARK_MODE_IMAGE_FIX : ""}`}
    />
  );
}

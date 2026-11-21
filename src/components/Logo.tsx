import logoGrey from "@/assets/img/brand/logo-grey.png";
import logoSilver from "@/assets/img/brand/logo-silver.png";
import { useSettingStore } from "@/store/settingStore";

type LogoProps = {
  className?: string;
};

export default function Logo({ className = "h-9" }: LogoProps) {
  const darkMode = useSettingStore((state) => state.darkMode);

  return (
    <img
      src={darkMode ? logoSilver : logoGrey}
      alt="Proofy"
      className={`w-auto ${className} ${darkMode ? "[filter:invert(1)_brightness(1.3)]" : ""}`}
    />
  );
}

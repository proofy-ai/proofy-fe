import { useEffect, type ReactNode } from "react";
import { useSettingStore } from "../store/settingStore";
import backgroundImg from "../assets/img/background.png";
import Toast from "@/components/common/Toast";
import Header from "@/components/Header";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const darkMode = useSettingStore((state) => state.darkMode);
  const largeTextMode = useSettingStore((state) => state.largeTextMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div
      className={`min-h-[100dvh] bg-[#f5f5f5] bg-cover bg-center bg-no-repeat font-sans ${largeTextMode ? "large-text-content" : ""}`}
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <Header />
      <Toast />
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-4 md:px-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}

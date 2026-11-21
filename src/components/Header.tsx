import { ChevronLeft, FolderOpen, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "@/components/Logo";

const headerPillButtonClass =
  "flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-[3px] border-white bg-white/70 px-3 transition-all duration-200 hover:shadow-lg active:scale-[0.95]";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isMyPage = location.pathname === "/me";
  const isSettings = location.pathname === "/settings";
  const isLogin = location.pathname === "/login";
  const isTopLevelPage = isMyPage || isSettings;
  const hasPreviousPage = location.key !== "default";

  function goBack() {
    if (isTopLevelPage || !hasPreviousPage) navigate("/");
    else navigate(-1);
  }

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          {!isHome && !isLogin && (
            <button
              type="button"
              aria-label="뒤로 가기"
              className="flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-1 transition-colors hover:bg-white/70"
              onClick={goBack}
            >
              <ChevronLeft size={24} strokeWidth={2.5} className="text-ink" />
            </button>
          )}
          <Link to="/" aria-label="Proofy 홈">
            <Logo className="h-8" />
          </Link>
        </div>

        {!isLogin && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="설정"
              aria-current={isSettings ? "page" : undefined}
              className={`${headerPillButtonClass} ${isSettings ? "bg-white" : ""}`}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              onClick={() => navigate("/settings")}
            >
              <Settings size={20} className="text-ink" />
            </button>
            <button
              type="button"
              aria-label="내 사건"
              aria-current={isMyPage ? "page" : undefined}
              className={`${headerPillButtonClass} ${isMyPage ? "bg-white" : ""}`}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              onClick={() => navigate("/me")}
            >
              <FolderOpen size={20} className="text-ink" />
              <span className="hidden text-sm font-medium text-ink md:inline">
                내 사건
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

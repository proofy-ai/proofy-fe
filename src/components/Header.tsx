import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, User } from "lucide-react";
import Logo from "@/components/Logo";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isMyPage = location.pathname === "/me";

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          {!isHome && (
            <button
              type="button"
              aria-label="뒤로 가기"
              className="flex cursor-pointer items-center justify-center border-none bg-transparent p-1"
              onClick={() =>
                window.history.length > 1 ? navigate(-1) : navigate("/")
              }
            >
              <ChevronLeft size={24} strokeWidth={2.5} className="text-ink" />
            </button>
          )}
          <Link to="/" aria-label="Proofy 홈">
            <Logo className="h-8" />
          </Link>
        </div>

        {!isMyPage && (
          <button
            type="button"
            aria-label="내 사건"
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-[3px] border-white bg-white/70 px-3 transition-all duration-200 hover:shadow-lg active:scale-[0.95]"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            onClick={() => navigate("/me")}
          >
            <User size={20} className="text-ink" />
            <span className="hidden text-sm font-medium text-ink md:inline">
              내 사건
            </span>
          </button>
        )}
      </div>
    </header>
  );
}

import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16">
      <div className="mb-8">
        <Logo className="h-20" />
      </div>

      <div className="text-center mb-8">
        <h1
          className="text-6xl font-bold mb-4"
          style={{
            background:
              "linear-gradient(90deg, rgb(var(--color-brand)) 0%, #9A9CEA 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 text-sm">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => navigate("/")}
          className="w-full py-3 px-6 rounded-full text-white font-medium transition-all duration-200 hover:shadow-lg"
          style={{
            background:
              "linear-gradient(90deg, rgb(var(--color-brand)) 0%, #9A9CEA 100%)",
          }}
        >
          홈으로 돌아가기
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 px-6 rounded-full font-medium transition-all duration-200 hover:bg-gray-100"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            border: "1px solid #E5E7EB",
            color: "#6B7280",
          }}
        >
          이전 페이지로
        </button>
      </div>
    </div>
  );
}

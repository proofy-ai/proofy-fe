import { Navigate, Outlet } from "react-router-dom";

import { useSessionStore } from "@/store/sessionStore";

export function RequireSelfStart() {
  const trialScenario = useSessionStore((state) => state.trialScenario);
  return trialScenario ? <Navigate to="/" replace /> : <Outlet />;
}

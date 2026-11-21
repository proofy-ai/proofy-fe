import { Navigate, Outlet } from "react-router-dom";

import { useSessionStore } from "@/store/sessionStore";

export default function RequireEntry() {
  const hasEntered = useSessionStore((state) => state.hasEntered);
  return hasEntered ? <Outlet /> : <Navigate to="/login" replace />;
}

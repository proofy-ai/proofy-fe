import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionStore {
  hasEntered: boolean;
  enter: () => void;
  leave: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      hasEntered: false,
      enter: () => set({ hasEntered: true }),
      leave: () => set({ hasEntered: false }),
    }),
    { name: "proofy.session" },
  ),
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SampleScenario } from "@/types/api";

type SessionStore = {
  hasEntered: boolean;
  trialScenario: SampleScenario | null;
  enter: (trialScenario?: SampleScenario) => void;
  leave: () => void;
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      hasEntered: false,
      trialScenario: null,
      enter: (trialScenario) =>
        set({ hasEntered: true, trialScenario: trialScenario ?? null }),
      leave: () => set({ hasEntered: false, trialScenario: null }),
    }),
    { name: "proofy.session" },
  ),
);

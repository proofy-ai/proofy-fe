import { create } from "zustand";

import type { ObjectionFormFields } from "@/lib/objectionForm";

type ObjectionFormStore = {
  fieldsByCase: Record<string, ObjectionFormFields>;
  save: (caseId: string, fields: ObjectionFormFields) => void;
  clear: (caseId: string) => void;
};

export const useObjectionFormStore = create<ObjectionFormStore>((set) => ({
  fieldsByCase: {},
  save: (caseId, fields) =>
    set((state) => ({
      fieldsByCase: { ...state.fieldsByCase, [caseId]: fields },
    })),
  clear: (caseId) =>
    set((state) => ({
      fieldsByCase: Object.fromEntries(
        Object.entries(state.fieldsByCase).filter(([id]) => id !== caseId),
      ),
    })),
}));

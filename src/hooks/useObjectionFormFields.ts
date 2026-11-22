import { useState } from "react";

import { readStoredCases } from "@/lib/caseStorage";
import { createInitialFormFields } from "@/lib/demoFormProfiles";
import { getKoreaToday } from "@/lib/koreaDate";
import type { ObjectionFormFields } from "@/lib/objectionForm";
import { useObjectionFormStore } from "@/store/objectionFormStore";

export const useObjectionFormFields = (caseId: string) => {
  const savedFields = useObjectionFormStore(
    (state) => state.fieldsByCase[caseId],
  );
  const save = useObjectionFormStore((state) => state.save);
  const [initialFields] = useState(() => {
    const storedCase = readStoredCases().find(
      (storedItem) => storedItem.caseId === caseId,
    );
    return createInitialFormFields(
      getKoreaToday(),
      storedCase?.sampleScenario ?? null,
    );
  });
  const fields = savedFields ?? initialFields;

  const setField = (key: keyof ObjectionFormFields, value: string) =>
    save(caseId, { ...fields, [key]: value });

  return { fields, setField };
};

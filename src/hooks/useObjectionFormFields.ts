import { useState } from "react";

import { getKoreaToday } from "@/lib/koreaDate";
import {
  createEmptyFormFields,
  type ObjectionFormFields,
} from "@/lib/objectionForm";
import { useObjectionFormStore } from "@/store/objectionFormStore";

export const useObjectionFormFields = (caseId: string) => {
  const savedFields = useObjectionFormStore(
    (state) => state.fieldsByCase[caseId],
  );
  const save = useObjectionFormStore((state) => state.save);
  const [emptyFields] = useState(() => createEmptyFormFields(getKoreaToday()));
  const fields = savedFields ?? emptyFields;

  const setField = (key: keyof ObjectionFormFields, value: string) =>
    save(caseId, { ...fields, [key]: value });

  return { fields, setField };
};

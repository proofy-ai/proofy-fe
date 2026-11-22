import { type RefObject, useState } from "react";

import { saveObjectionPdf } from "@/lib/objectionPdf";
import { useToastStore } from "@/store/toastStore";

const PDF_FILE_NAME = "이의제기신청서.pdf";

export const useObjectionPdf = (
  containerRef: RefObject<HTMLDivElement | null>,
) => {
  const showToast = useToastStore((state) => state.show);
  const [isSaving, setIsSaving] = useState(false);

  const savePdf = async () => {
    if (!containerRef.current) return;
    setIsSaving(true);
    try {
      await saveObjectionPdf(containerRef.current, PDF_FILE_NAME);
      showToast("PDF를 저장했어요", "success");
    } catch {
      showToast("PDF를 만들지 못했어요. 잠시 후 다시 시도해 주세요.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, savePdf };
};

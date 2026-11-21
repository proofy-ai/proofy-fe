import { useEffect, useRef, useState } from "react";

export const useEvidencePreviews = () => {
  const objectUrlsRef = useRef(new Map<string, string>());
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const addPreview = (evidenceId: string, file: File) => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.set(evidenceId, url);
    setPreviewUrls((current) => ({ ...current, [evidenceId]: url }));
  };

  const removePreview = (evidenceId: string) => {
    const url = objectUrlsRef.current.get(evidenceId);
    if (!url) return;

    URL.revokeObjectURL(url);
    objectUrlsRef.current.delete(evidenceId);
    setPreviewUrls((current) =>
      Object.fromEntries(
        Object.entries(current).filter(([id]) => id !== evidenceId),
      ),
    );
  };

  return { previewUrls, addPreview, removePreview };
};

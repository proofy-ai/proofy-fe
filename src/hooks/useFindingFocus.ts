import { useEffect, useRef } from "react";

import type { ResultTabKey } from "@/lib/resultTabs";

export const getFindingElementId = (findingId: string) =>
  `finding-${findingId}`;

export const useFindingFocus = (
  activeTab: ResultTabKey,
  onTabChange: (tab: ResultTabKey) => void,
) => {
  const pendingFindingIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeTab !== "FINDINGS" || !pendingFindingIdRef.current) return;

    document
      .getElementById(getFindingElementId(pendingFindingIdRef.current))
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    pendingFindingIdRef.current = null;
  }, [activeTab]);

  return (findingId: string) => {
    pendingFindingIdRef.current = findingId;
    onTabChange("FINDINGS");
  };
};

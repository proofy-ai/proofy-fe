import { useEffect, useState } from "react";

import { type ChatItem, getTypingDelay } from "@/lib/chatItems";

export const useChatReveal = (items: ChatItem[]) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const nextItem = items[visibleCount];
  const nextDelay = nextItem ? getTypingDelay(nextItem) : null;

  useEffect(() => {
    if (nextDelay === null) return;
    const timerId = setTimeout(
      () => setVisibleCount((count) => count + 1),
      nextDelay,
    );
    return () => clearTimeout(timerId);
  }, [visibleCount, nextDelay]);

  return {
    visibleItems: items.slice(0, visibleCount),
    isTyping: nextItem?.kind === "pruppy",
    isAllVisible: visibleCount >= items.length,
  };
};

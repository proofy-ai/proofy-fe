import { useEffect, useState } from "react";

export const useStaggeredCount = (total: number, intervalMs: number) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= total) return;
    const timerId = setTimeout(() => setCount(count + 1), intervalMs);
    return () => clearTimeout(timerId);
  }, [count, total, intervalMs]);

  return Math.min(count, total);
};

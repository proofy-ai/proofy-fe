import { useEffect, useRef, useState } from "react";

const VISIBLE_RATIO = 0.2;

export const useInView = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { threshold: VISIBLE_RATIO },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
};

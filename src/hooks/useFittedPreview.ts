import { useEffect, useRef, useState } from "react";

import { PAGE_WIDTH_PX } from "@/lib/objectionForm";

export const useFittedPreview = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;
    const measure = () => {
      setScale(wrapper.clientWidth / PAGE_WIDTH_PX);
      setContentHeight(content.offsetHeight);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return { wrapperRef, contentRef, scale, scaledHeight: contentHeight * scale };
};

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

type Props = {
  title?: string;
  titleClassName?: string;
  children: ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  bgGradientFrom?: string;
  bgGradientTo?: string;
  bgOpacity?: number;
  borderWidth?: number;
  borderRadius?: number;
  textColor?: string;
  className?: string;
};

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function GlassCard({
  title,
  titleClassName = "text-base",
  children,
  gradientFrom = "#EEEEEE",
  gradientTo = "#999999",
  bgGradientFrom = "#FFFFFF",
  bgGradientTo = "#FFFFFF",
  bgOpacity = 0.7,
  borderWidth = 1,
  borderRadius = 24,
  textColor = "#000000",
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const half = borderWidth / 2;

  return (
    <div ref={containerRef} className={`relative flex w-full ${className}`}>
      {size.w > 0 && (
        <svg
          width={size.w}
          height={size.h}
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient
              id={`grad-border-${uid}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
          <rect
            x={half}
            y={half}
            width={size.w - borderWidth}
            height={size.h - borderWidth}
            rx={borderRadius - half}
            ry={borderRadius - half}
            fill="none"
            stroke={`url(#grad-border-${uid})`}
            strokeWidth={borderWidth}
          />
        </svg>
      )}

      <div
        className="relative flex items-center w-full "
        style={{
          background: `linear-gradient(135deg, 
            ${hexToRgba(bgGradientFrom, bgOpacity)}, 
            ${hexToRgba(bgGradientTo, bgOpacity)}
          )`,
          borderRadius: `${borderRadius}px`,
          padding: "16px 18px",
        }}
      >
        <div className="flex-1 min-w-0">
          {!!title && (
            <h3
              className={`${titleClassName} font-semibold mb-3`}
              style={{ color: textColor }}
            >
              {title}
            </h3>
          )}

          <div className="text-sm text-black">{children}</div>
        </div>
      </div>
    </div>
  );
}

import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  bgColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

export default function GradientButton({
  children,
  onClick,
  bgColor = "rgb(var(--color-brand-button))",
  gradientFrom = "rgb(var(--color-brand-pale))",
  gradientTo = "rgb(var(--color-brand))",
  textColor = "#FFFFFF",
  borderWidth = 3,
  borderRadius,
  className = "",
  buttonClassName = "",
  disabled = false,
  fullWidth = false,
}: Props) {
  return (
    <div
      className={`rounded-full transition-all duration-200
    ${fullWidth ? "w-full" : ""} 
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-[1.03] hover:shadow-lg active:scale-[0.97]"} 
    ${className}`}
      style={{
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        padding: borderWidth,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={`gradient-btn flex items-center justify-center gap-2 rounded-full font-semibold
      hover:opacity-90
      ${fullWidth ? "w-full" : ""} 
      ${disabled ? "cursor-not-allowed" : ""} 
      ${buttonClassName}`}
        style={{
          borderRadius: borderRadius ? `${borderRadius}px` : undefined,
          backgroundColor: bgColor,
          padding: "10px 24px",
          color: textColor,
        }}
      >
        {children}
      </button>
    </div>
  );
}

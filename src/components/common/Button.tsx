import type { ButtonHTMLAttributes, ReactNode } from "react";

const SIZE_STYLES = {
  lg: "px-6 py-4",
  md: "px-5 py-2.5",
  sm: "px-4 py-1.5",
};

type ButtonProps = {
  children: ReactNode;
  fullWidth?: boolean;
  size?: keyof typeof SIZE_STYLES;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  disabled = false,
  fullWidth = false,
  size = "lg",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2
        ${SIZE_STYLES[size]} rounded-full
        bg-brand text-white text-base font-semibold
        transition-all duration-200
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-strong active:scale-95 cursor-pointer"}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

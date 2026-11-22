import type { ButtonHTMLAttributes, ReactNode } from "react";

const SIZE_STYLES = {
  lg: "px-5 py-3 text-base",
  md: "px-4 py-2 text-base",
  sm: "px-3 py-1 text-sm",
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
        bg-brand-strong text-white font-semibold
        transition-all duration-300 ease-smooth
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.03] hover:bg-brand active:scale-[0.97] cursor-pointer"}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  children,
  disabled = false,
  fullWidth = false,
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
        px-6 py-4 rounded-full
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

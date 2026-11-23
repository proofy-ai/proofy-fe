import type { ReactNode } from "react";

export const COLLAPSE_DURATION_MILLISECONDS = 600;

type Props = {
  isOpen: boolean;
  as?: "div" | "li";
  closedClassName?: string;
  children: ReactNode;
};

export function Collapsible({
  isOpen,
  as: Tag = "div",
  closedClassName = "",
  children,
}: Props) {
  const stateClassName = isOpen
    ? "grid-rows-[1fr] opacity-100"
    : `grid-rows-[0fr] opacity-0 ${closedClassName}`;

  return (
    <Tag
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={`grid transition-[grid-template-rows,opacity,margin] duration-600 ease-smooth motion-reduce:transition-none ${stateClassName}`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </Tag>
  );
}

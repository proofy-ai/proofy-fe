import { ChevronDown } from "lucide-react";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
};

export function DraftAdviceToggle({ isOpen, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={onToggle}
      className="ml-auto flex cursor-pointer items-center gap-1 text-xs font-semibold text-brand-strong"
    >
      프루피의 조언
      <ChevronDown
        className={`h-4 w-4 transition-transform duration-300 ease-smooth ${
          isOpen ? "rotate-180" : ""
        }`}
        aria-hidden
      />
    </button>
  );
}

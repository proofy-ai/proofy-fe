import { ChevronDown } from "lucide-react";

type Props = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
};

export function DisclosureButton({ title, isOpen, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={onToggle}
      className="flex w-full cursor-pointer items-center justify-between rounded-full bg-gray-200 px-4 py-2.5 text-left text-ink transition-all duration-300 ease-smooth hover:scale-[1.01] hover:bg-gray-300 active:scale-[0.98]"
    >
      <span className="break-keep font-semibold">{title}</span>
      <ChevronDown
        className={`h-5 w-5 shrink-0 transition-transform duration-300 ease-smooth ${
          isOpen ? "rotate-180" : ""
        }`}
        aria-hidden
      />
    </button>
  );
}

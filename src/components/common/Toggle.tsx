const SIZE_STYLES = {
  md: {
    track: "h-8 w-14",
    knob: "h-6 w-6",
    knobOff: "translate-x-1",
    knobOn: "translate-x-7",
  },
  sm: {
    track: "h-5 w-9",
    knob: "h-4 w-4",
    knobOff: "translate-x-0.5",
    knobOn: "translate-x-4",
  },
} satisfies Record<
  string,
  { track: string; knob: string; knobOff: string; knobOn: string }
>;

type ToggleProps = {
  size?: keyof typeof SIZE_STYLES;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function Toggle({
  checked,
  onChange,
  disabled = false,
  size = "md",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex ${SIZE_STYLES[size].track} items-center rounded-full transition-all duration-200 ease-in-out
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:brightness-95"}
      `}
      style={{
        background: checked
          ? "linear-gradient(135deg, rgb(var(--color-brand-light) / 0.9), rgb(var(--color-brand) / 0.8))"
          : "linear-gradient(135deg, rgba(220, 220, 220, 0.9), rgba(180, 180, 180, 0.7))",
        boxShadow: checked
          ? "inset 0 1px 3px rgba(255,255,255,0.4), 0 2px 8px rgb(var(--color-brand) / 0.3)"
          : "inset 0 1px 3px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.1)",
        border: checked
          ? "1px solid rgba(255,255,255,0.5)"
          : "1px solid rgba(255,255,255,0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <span
        className={`
          inline-block ${SIZE_STYLES[size].knob} transform rounded-full transition-transform duration-200 ease-in-out
          ${checked ? SIZE_STYLES[size].knobOn : SIZE_STYLES[size].knobOff}
        `}
        style={{
          background: checked
            ? "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(220,230,255,0.9))"
            : "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(240,240,240,0.9))",
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.8)",
        }}
      />
    </button>
  );
}

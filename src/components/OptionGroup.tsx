type Option<Value extends string> = {
  value: Value;
  label: string;
};

type Props<Value extends string> = {
  legend: string;
  name: string;
  options: Option<Value>[];
  value: Value | "";
  onChange: (value: Value) => void;
  error?: string;
};

export function OptionGroup<Value extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  error,
}: Props<Value>) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-medium text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm text-ink transition-colors duration-300 ease-smooth has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand ${
              value === option.value
                ? "border-brand bg-brand-soft font-semibold"
                : "border-brand-line bg-white/70 hover:bg-brand-soft"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

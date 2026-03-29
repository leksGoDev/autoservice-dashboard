type InlineOption<T extends string> = {
  value: T;
  label: string;
};

type InlineSelectControlProps<T extends string> = {
  value: T;
  options: InlineOption<T>[];
  ariaLabel: string;
  isBusy: boolean;
  isDirty: boolean;
  isPending: boolean;
  pendingLabel: string;
  actionLabel: string;
  onChange: (next: T) => void;
  onSubmit: () => void;
};

export const InlineSelectControl = <T extends string>({
  value,
  options,
  ariaLabel,
  isBusy,
  isDirty,
  isPending,
  pendingLabel,
  actionLabel,
  onChange,
  onSubmit,
}: InlineSelectControlProps<T>) => {
  const submitLabel = isPending ? pendingLabel : actionLabel;

  return (
    <div className="inline-flex min-w-0 items-center gap-1.5">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        disabled={isBusy}
        className="max-w-[168px] rounded-[8px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2 py-1.5 text-[11px] text-[var(--color-text-primary)]"
        aria-label={ariaLabel}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {isDirty ? (
        <button
          type="button"
          className="grid h-7 w-7 place-items-center cursor-pointer rounded-[8px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] text-[13px] font-semibold text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onSubmit}
          disabled={isBusy}
          aria-label={submitLabel}
          title={submitLabel}
        >
          <span aria-hidden="true">✓</span>
        </button>
      ) : null}
    </div>
  );
};

import type { ReactNode } from "react";

type SelectOption<T extends string> = {
  value: T;
  label: ReactNode;
};

type LabeledSelectControlProps<T extends string> = {
  label: string;
  value: T;
  options: SelectOption<T>[];
  ariaLabel: string;
  isBusy: boolean;
  actionLabel: string;
  actionPendingLabel: string;
  isActionPending: boolean;
  isActionDisabled: boolean;
  onChange: (next: T) => void;
  onAction: () => void;
};

export const LabeledSelectControl = <T extends string>({
  label,
  value,
  options,
  ariaLabel,
  isBusy,
  actionLabel,
  actionPendingLabel,
  isActionPending,
  isActionDisabled,
  onChange,
  onAction,
}: LabeledSelectControlProps<T>) => {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
      <label className="grid gap-1">
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">{label}</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          disabled={isBusy}
          className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
          aria-label={ariaLabel}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-3 py-2 text-xs text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
        onClick={onAction}
        disabled={isActionDisabled}
      >
        {isActionPending ? actionPendingLabel : actionLabel}
      </button>
    </div>
  );
};

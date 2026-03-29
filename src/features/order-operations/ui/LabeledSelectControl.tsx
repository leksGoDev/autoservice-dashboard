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
  const labelClassName = "text-xs leading-[18px] font-semibold text-[var(--color-text-secondary)]";
  const controlTextClassName = "text-sm leading-5 text-[var(--color-text-primary)]";
  const actionTextClassName = "text-xs leading-4 font-medium text-[var(--color-text-primary)]";

  return (
    <div className="grid gap-1">
      <span className={labelClassName}>{label}</span>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          disabled={isBusy}
          className={`h-10 rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 ${controlTextClassName}`}
          aria-label={ariaLabel}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={`inline-flex h-10 items-center justify-center cursor-pointer whitespace-nowrap rounded-[10px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-3 ${actionTextClassName} disabled:cursor-not-allowed disabled:opacity-60`}
          onClick={onAction}
          disabled={isActionDisabled}
        >
          {isActionPending ? actionPendingLabel : actionLabel}
        </button>
      </div>
    </div>
  );
};

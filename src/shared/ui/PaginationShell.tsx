import styles from "./RegistryPrimitives.module.css";

type PaginationShellProps = {
  summary: string;
  pageLabel: string;
  prevLabel: string;
  nextLabel: string;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export const PaginationShell = ({
  summary,
  pageLabel,
  prevLabel,
  nextLabel,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: PaginationShellProps) => {
  return (
    <footer
      className={`${styles.paginationBorder} flex items-center justify-between gap-2.5 pt-3 max-[960px]:flex-col max-[960px]:items-stretch`}
    >
      <span className="text-[13px] text-[var(--color-text-secondary)]">{summary}</span>
      <div className="inline-flex items-center gap-2">
        <span className="text-[13px] text-[var(--color-text-secondary)]">{pageLabel}</span>
        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-2.5 py-2 text-xs font-semibold text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-45"
          onClick={onPrev}
          disabled={!canGoPrev}
        >
          {prevLabel}
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-2.5 py-2 text-xs font-semibold text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-45"
          onClick={onNext}
          disabled={!canGoNext}
        >
          {nextLabel}
        </button>
      </div>
    </footer>
  );
};

import "./registry-primitives.css";

import type { FC } from "react";

interface PaginationShellProps {
  summary: string;
  pageLabel: string;
  prevLabel: string;
  nextLabel: string;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const PaginationShell: FC<PaginationShellProps> = ({
  summary,
  pageLabel,
  prevLabel,
  nextLabel,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}) => {
  return (
    <footer className="pagination-shell">
      <span className="pagination-shell__summary">{summary}</span>
      <div className="pagination-shell__controls">
        <span className="pagination-shell__page">{pageLabel}</span>
        <button type="button" className="pagination-shell__button" onClick={onPrev} disabled={!canGoPrev}>
          {prevLabel}
        </button>
        <button type="button" className="pagination-shell__button" onClick={onNext} disabled={!canGoNext}>
          {nextLabel}
        </button>
      </div>
    </footer>
  );
};

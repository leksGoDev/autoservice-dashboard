import type { UseQueryResult } from "@tanstack/react-query";
import type { WorkBoardData } from "@/entities/work-board/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { WorkBoardColumns } from "@/widgets/work-board-columns/WorkBoardColumns";

type WorkBoardOverviewProps = {
  boardQuery: UseQueryResult<WorkBoardData, Error>;
};

export const WorkBoardOverview = ({ boardQuery }: WorkBoardOverviewProps) => {
  const { t } = useI18n();
  const columns = boardQuery.data?.columns ?? [];
  const totalCards = boardQuery.data?.totalCards ?? 0;

  return (
    <section className="grid gap-5">
      <header className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
          {t("pages.workBoard.eyebrow")}
        </span>
        <h1 className="my-[10px] text-[28px] leading-[1.15]">{t("pages.workBoard.title")}</h1>
        <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.workBoard.description")}</p>
      </header>

      <div className="grid gap-3 text-xs text-[var(--color-text-secondary)] md:grid-cols-2">
        <div className="rounded-xl border border-[rgba(154,164,178,0.2)] bg-[rgba(15,17,21,0.4)] px-3 py-2.5">
          {t("pages.workBoard.summary.totalOrders", { count: totalCards })}
        </div>
        <div className="rounded-xl border border-[rgba(154,164,178,0.2)] bg-[rgba(15,17,21,0.4)] px-3 py-2.5">
          {t("pages.workBoard.summary.columns", { count: columns.length })}
        </div>
      </div>

      {boardQuery.isLoading ? <DataState message={t("pages.workBoard.states.loading")} /> : null}

      {boardQuery.isError ? (
        <DataState
          tone="error"
          message={t("pages.workBoard.states.error")}
          action={
            <button
              type="button"
              className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
              onClick={() => boardQuery.refetch()}
            >
              {t("common.retry")}
            </button>
          }
        />
      ) : null}

      {!boardQuery.isLoading && !boardQuery.isError && (!boardQuery.data || totalCards === 0) ? (
        <DataState message={t("pages.workBoard.states.empty")} />
      ) : null}

      {!boardQuery.isLoading && !boardQuery.isError && boardQuery.data && totalCards > 0 ? (
        <WorkBoardColumns columns={columns} />
      ) : null}
    </section>
  );
};

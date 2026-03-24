import { useWorkBoardQuery } from "@/entities/work-board/api/queries";
import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { WorkBoardColumns } from "@/widgets/work-board-columns/WorkBoardColumns";

export const WorkBoardPage = () => {
  const { t } = useI18n();
  const boardQuery = useWorkBoardQuery();

  const columns = boardQuery.data?.columns ?? [];
  const totalCards = boardQuery.data?.totalCards ?? 0;
  const header = (
    <header className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
        {t("pages.workBoard.eyebrow")}
      </span>
      <h1 className="my-[10px] text-[28px] leading-[1.15]">{t("pages.workBoard.title")}</h1>
      <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.workBoard.description")}</p>

      <div className="mt-4 grid gap-3 text-xs text-[var(--color-text-secondary)] md:grid-cols-2">
        <div className="rounded-xl border border-[rgba(154,164,178,0.2)] bg-[rgba(15,17,21,0.4)] px-3 py-2.5">
          {t("pages.workBoard.summary.totalOrders", { count: totalCards })}
        </div>
        <div className="rounded-xl border border-[rgba(154,164,178,0.2)] bg-[rgba(15,17,21,0.4)] px-3 py-2.5">
          {t("pages.workBoard.summary.columns", { count: columns.length })}
        </div>
      </div>
    </header>
  );

  if (boardQuery.isLoading) {
    return (
      <section className="grid gap-5">
        {header}
        <DataState message={t("pages.workBoard.states.loading")} />
      </section>
    );
  }

  if (boardQuery.isError) {
    return (
      <section className="grid gap-5">
        {header}
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
      </section>
    );
  }

  if (!boardQuery.data || totalCards === 0) {
    return (
      <section className="grid gap-5">
        {header}
        <DataState message={t("pages.workBoard.states.empty")} />
      </section>
    );
  }

  return (
    <section className="grid gap-5">
      {header}
      <WorkBoardColumns columns={columns} />
    </section>
  );
};

import { DataState } from "@/shared/ui/DataState";
import { PaginationShell } from "@/shared/ui/PaginationShell";
import { useI18n } from "@/shared/i18n/use-i18n";
import type { AppointmentsSchedulingModel } from "../hooks/use-appointments-scheduling-model";
import { AppointmentsGroupSection } from "./AppointmentsGroupSection";

type AppointmentsSchedulingContentProps = {
  model: AppointmentsSchedulingModel;
};

export const AppointmentsSchedulingContent = ({ model }: AppointmentsSchedulingContentProps) => {
  const { t } = useI18n();

  if (model.listQuery.isLoading) {
    return <DataState message={t("pages.appointments.states.loading")} />;
  }

  if (model.listQuery.isError) {
    return (
      <DataState
        message={t("pages.appointments.states.error")}
        tone="error"
        action={
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 text-xs leading-4 font-medium text-[var(--color-text-primary)]"
            onClick={() => model.listQuery.refetch()}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  const allRowsCount = model.groups.reduce((count, group) => count + group.items.length, 0);

  if (allRowsCount === 0) {
    return <DataState message={t("pages.appointments.states.empty")} />;
  }

  const canGoPrev = model.page > 1;
  const canGoNext = model.page < model.totalPages;

  return (
    <section className="grid min-w-0 gap-4">
      {model.groups.map((group) => (
        <AppointmentsGroupSection
          key={group.key}
          title={t(`pages.appointments.groups.${group.key}.title`) as string}
          emptyLabel={t(`pages.appointments.groups.${group.key}.empty`) as string}
          items={group.items}
          mechanics={model.mechanics}
        />
      ))}

      <section className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] px-3.5 pb-3 pt-1">
        <PaginationShell
          summary={`${t("pages.appointments.table.pagination.total", { total: model.total })}${model.listQuery.isFetching ? ` · ${t("pages.appointments.table.pagination.updating")}` : ""}`}
          pageLabel={t("pages.appointments.table.pagination.page", {
            page: model.page,
            totalPages: model.totalPages,
          })}
          prevLabel={t("pages.appointments.table.pagination.prev")}
          nextLabel={t("pages.appointments.table.pagination.next")}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPrev={() => model.onPageChange(model.page - 1)}
          onNext={() => model.onPageChange(model.page + 1)}
        />
      </section>
    </section>
  );
};

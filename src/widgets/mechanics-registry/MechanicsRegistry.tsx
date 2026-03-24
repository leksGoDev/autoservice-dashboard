import { useMemo } from "react";

import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { useMechanicsRegistryModel } from "./model/use-mechanics-registry-model";
import { MechanicsAssignmentsCard } from "./ui/MechanicsAssignmentsCard";
import { MechanicsAvailabilityCard } from "./ui/MechanicsAvailabilityCard";
import { MechanicsRegistryHeader } from "./ui/MechanicsRegistryHeader";
import { MechanicsRegistryTable } from "./ui/MechanicsRegistryTable";

export const MechanicsRegistry = () => {
  const { t } = useI18n();
  const model = useMechanicsRegistryModel();
  const header = (
    <MechanicsRegistryHeader
      range={model.range}
      searchInput={model.searchInput}
      onRangeChange={model.setRange}
      onSearchInputChange={model.setSearchInput}
      onSearchSubmit={model.handleSearchSubmit}
    />
  );

  const summary = useMemo(() => {
    if (!model.data || model.data.total === 0) {
      return t("pages.mechanics.table.summaryEmpty");
    }

    const start = (model.data.page - 1) * model.data.pageSize + 1;
    const end = start + model.data.items.length - 1;

    return t("pages.mechanics.table.summary", {
      start,
      end,
      total: model.data.total,
    });
  }, [model.data, t]);

  if (model.registryQuery.isLoading || model.workloadQuery.isLoading) {
    return (
      <section className="grid gap-5">
        {header}
        <DataState message={t("pages.mechanics.states.loading")} />
      </section>
    );
  }

  if (model.registryQuery.isError || model.workloadQuery.isError) {
    return (
      <section className="grid gap-5">
        {header}
        <DataState
          tone="error"
          message={t("pages.mechanics.states.error")}
          action={
            <button
              type="button"
              className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
              onClick={model.handleRetry}
            >
              {t("common.retry")}
            </button>
          }
        />
      </section>
    );
  }

  if (model.rows.length === 0) {
    return (
      <section className="grid gap-5">
        {header}
        <DataState message={t("pages.mechanics.states.empty")} />
      </section>
    );
  }

  return (
    <section className="grid gap-5">
      {header}
      <MechanicsRegistryTable
        rows={model.rows}
        page={model.data?.page ?? 1}
        totalPages={model.data?.totalPages ?? 1}
        summary={summary}
        canGoPrev={Boolean(model.data && model.data.page > 1 && !model.registryQuery.isFetching)}
        canGoNext={Boolean(
          model.data && model.data.page < model.data.totalPages && !model.registryQuery.isFetching,
        )}
        onPrev={() => model.setPage((value) => Math.max(1, value - 1))}
        onNext={() => model.setPage((value) => value + 1)}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <MechanicsAvailabilityCard
          counts={model.availability.counts}
          averageUtilization={model.availability.averageUtilization}
        />
        <MechanicsAssignmentsCard leaders={model.assignmentLeaders} />
      </div>
    </section>
  );
};

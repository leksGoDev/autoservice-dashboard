import { useMemo } from "react";

import { useI18n } from "@/shared/i18n/use-i18n";
import { useMechanicsRegistryModel } from "./model/use-mechanics-registry-model";
import { MechanicsRegistryContent } from "./ui/MechanicsRegistryContent";
import { MechanicsRegistryHeader } from "./ui/MechanicsRegistryHeader";

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

  return (
    <section className="grid gap-5">
      {header}
      <MechanicsRegistryContent
        isLoading={model.registryQuery.isLoading || model.workloadQuery.isLoading}
        isError={model.registryQuery.isError || model.workloadQuery.isError}
        rows={model.rows}
        page={model.data?.page ?? 1}
        totalPages={model.data?.totalPages ?? 1}
        summary={summary}
        canGoPrev={Boolean(model.data && model.data.page > 1 && !model.registryQuery.isFetching)}
        canGoNext={Boolean(
          model.data && model.data.page < model.data.totalPages && !model.registryQuery.isFetching,
        )}
        availability={model.availability}
        assignmentLeaders={model.assignmentLeaders}
        onRetry={model.handleRetry}
        onPrev={() => model.setPage((value) => Math.max(1, value - 1))}
        onNext={() => model.setPage((value) => value + 1)}
      />
    </section>
  );
};

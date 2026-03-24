import { useMechanicsRegistryModel } from "./model/use-mechanics-registry-model";
import { MechanicsRegistryContent } from "./ui/MechanicsRegistryContent";
import { MechanicsRegistryHeader } from "./ui/MechanicsRegistryHeader";

export const MechanicsRegistry = () => {
  const model = useMechanicsRegistryModel();

  return (
    <section className="grid gap-5">
      <MechanicsRegistryHeader
        range={model.range}
        searchInput={model.searchInput}
        onRangeChange={model.setRange}
        onSearchInputChange={model.setSearchInput}
        onSearchSubmit={model.handleSearchSubmit}
      />
      <MechanicsRegistryContent
        isLoading={model.registryQuery.isLoading || model.workloadQuery.isLoading}
        isError={model.registryQuery.isError || model.workloadQuery.isError}
        rows={model.rows}
        page={model.data?.page ?? 1}
        totalPages={model.data?.totalPages ?? 1}
        summary={model.summary}
        canGoPrev={model.canGoPrev}
        canGoNext={model.canGoNext}
        availability={model.availability}
        assignmentLeaders={model.assignmentLeaders}
        onRetry={model.handleRetry}
        onPrev={() => model.setPage((value) => Math.max(1, value - 1))}
        onNext={() => model.setPage((value) => value + 1)}
      />
    </section>
  );
};

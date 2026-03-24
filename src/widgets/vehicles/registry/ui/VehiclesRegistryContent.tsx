import type { useVehiclesRegistryModel } from "../model/use-vehicles-registry-model";
import { VehiclesEmptyState, VehiclesErrorState, VehiclesLoadingState } from "./VehiclesRegistryStates";
import { VehiclesRegistryTable } from "./VehiclesRegistryTable";

type VehiclesRegistryContentProps = {
  model: ReturnType<typeof useVehiclesRegistryModel>;
};

export const VehiclesRegistryContent = ({ model }: VehiclesRegistryContentProps) => {
  if (model.query.isLoading) {
    return <VehiclesLoadingState />;
  }

  if (model.query.isError) {
    return <VehiclesErrorState onRetry={() => model.query.refetch()} />;
  }

  if (!model.data || !model.hasRows) {
    return <VehiclesEmptyState hasActiveSearch={model.hasActiveSearch} />;
  }

  return (
    <VehiclesRegistryTable
      data={model.data.items}
      summary={model.summary}
      page={model.data.page}
      totalPages={model.data.totalPages}
      canPrev={model.data.page > 1 && !model.query.isFetching}
      canNext={model.data.page < model.data.totalPages && !model.query.isFetching}
      onPrev={() => model.setPage((value) => Math.max(1, value - 1))}
      onNext={() => model.setPage((value) => value + 1)}
    />
  );
};

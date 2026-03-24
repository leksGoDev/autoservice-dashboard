import { useVehiclesRegistryModel } from "./model/use-vehicles-registry-model";
import { VehiclesRegistryContent } from "./ui/VehiclesRegistryContent";
import { VehiclesRegistryHeader } from "./ui/VehiclesRegistryHeader";

export const VehiclesRegistry = () => {
  const model = useVehiclesRegistryModel();

  return (
    <section className="grid gap-5">
      <VehiclesRegistryHeader
        hasActiveSearch={model.hasActiveSearch}
        searchInput={model.searchInput}
        onSearchInputChange={model.setSearchInput}
        onSubmit={model.handleSearchSubmit}
        onClearSearch={model.handleClearSearch}
      />
      <VehiclesRegistryContent model={model} />
    </section>
  );
};

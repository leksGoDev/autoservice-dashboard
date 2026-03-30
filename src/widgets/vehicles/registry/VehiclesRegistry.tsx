import { useState } from "react";

import { CreateVehicleForm } from "@/features/vehicle-management/ui/CreateVehicleForm";
import { useVehiclesRegistryModel } from "./hooks/use-vehicles-registry-model";
import { VehiclesRegistryContent } from "./ui/VehiclesRegistryContent";
import { VehiclesRegistryHeader } from "./ui/VehiclesRegistryHeader";

export const VehiclesRegistry = () => {
  const model = useVehiclesRegistryModel();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <section className="grid gap-5">
      <VehiclesRegistryHeader
        hasActiveSearch={model.hasActiveSearch}
        searchInput={model.searchInput}
        onSearchInputChange={model.setSearchInput}
        onSubmit={model.handleSearchSubmit}
        onClearSearch={model.handleClearSearch}
        isCreateOpen={isCreateOpen}
        onToggleCreate={() => setIsCreateOpen((value) => !value)}
      />
      {isCreateOpen ? (
        <CreateVehicleForm onSubmitted={() => setIsCreateOpen(false)} onCancel={() => setIsCreateOpen(false)} />
      ) : null}
      <VehiclesRegistryContent model={model} />
    </section>
  );
};

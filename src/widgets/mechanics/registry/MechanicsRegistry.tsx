import { useMechanicsRegistryModel } from "./hooks/use-mechanics-registry-model";
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
      <MechanicsRegistryContent model={model} />
    </section>
  );
};

import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { CustomersRegistrySearch } from "./CustomersRegistrySearch";
import { useCustomersRegistryModel } from "./hooks/use-customers-registry-model";
import { CustomersRegistryContent } from "./ui/CustomersRegistryContent";

export const CustomersRegistry = () => {
  const { t } = useI18n();
  const model = useCustomersRegistryModel();

  return (
    <WidgetCard
      title={t("customersRegistry.title")}
      description={t("customersRegistry.description")}
      className="grid gap-4"
    >
      <CustomersRegistrySearch
        value={model.search}
        onChange={(event) => model.handleSearchChange(event.target.value)}
      />
      <CustomersRegistryContent model={model} />
    </WidgetCard>
  );
};

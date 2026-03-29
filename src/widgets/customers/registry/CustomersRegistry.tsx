import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { CustomersRegistrySearch } from "./CustomersRegistrySearch";
import { useCustomersRegistryModel } from "./hooks/use-customers-registry-model";
import { CustomersRegistryContent } from "./ui/CustomersRegistryContent";

export const CustomersRegistry = () => {
  const { t } = useI18n();
  const model = useCustomersRegistryModel();

  return (
    <section className="grid gap-5">
      <section className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
          {t("pages.customers.eyebrow")}
        </span>
        <h1 className="m-0 mt-2.5 text-[28px] leading-[1.15]">{t("pages.customers.title")}</h1>
        <p className="m-0 text-base leading-6 text-[var(--color-text-secondary)]">{t("pages.customers.description")}</p>
      </section>

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
    </section>
  );
};

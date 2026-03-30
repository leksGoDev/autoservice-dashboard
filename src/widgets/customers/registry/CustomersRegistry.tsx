import { useState } from "react";

import { CustomerForm } from "@/features/customer-management/ui/CustomerForm";
import { useI18n } from "@/shared/i18n/use-i18n";
import { headerPrimaryActionButtonClassName } from "@/shared/ui/class-names";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { CustomersRegistrySearch } from "./CustomersRegistrySearch";
import { useCustomersRegistryModel } from "./hooks/use-customers-registry-model";
import { CustomersRegistryContent } from "./ui/CustomersRegistryContent";

export const CustomersRegistry = () => {
  const { t } = useI18n();
  const model = useCustomersRegistryModel();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <section className="grid gap-5">
      <section className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="grid gap-2.5">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
              {t("pages.customers.eyebrow")}
            </span>
            <h1 className="m-0 text-[28px] leading-[1.15]">{t("pages.customers.title")}</h1>
            <p className="m-0 text-base leading-6 text-[var(--color-text-secondary)]">{t("pages.customers.description")}</p>
          </div>

          <button
            type="button"
            className={headerPrimaryActionButtonClassName}
            onClick={() => setIsCreateOpen((value) => !value)}
          >
            {isCreateOpen ? t("pages.customers.form.cancelAction") : t("pages.customers.actions.create")}
          </button>
        </div>
      </section>

      {isCreateOpen ? (
        <CustomerForm
          mode="create"
          onSubmitted={() => {
            setIsCreateOpen(false);
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      ) : null}

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

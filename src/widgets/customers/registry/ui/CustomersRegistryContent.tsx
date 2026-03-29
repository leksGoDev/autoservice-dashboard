import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { PaginationShell } from "@/shared/ui/PaginationShell";
import { CustomersRegistryTable } from "../CustomersRegistryTable";
import type { CustomersRegistryModel } from "../model/use-customers-registry-model";

type CustomersRegistryContentProps = {
  model: CustomersRegistryModel;
};

export const CustomersRegistryContent = ({ model }: CustomersRegistryContentProps) => {
  const { t } = useI18n();

  if (model.isLoading) {
    return <DataState message={t("customersRegistry.states.loading")} />;
  }

  if (model.isError) {
    return (
      <DataState
        tone="error"
        message={t("customersRegistry.states.error")}
        action={
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={() => model.query.refetch()}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (model.isEmpty || !model.data) {
    return <DataState message={t("customersRegistry.states.empty")} />;
  }

  return (
    <>
      <CustomersRegistryTable rows={model.data.items} />

      <PaginationShell
        summary={model.summary}
        pageLabel={model.pageLabel}
        prevLabel={t("customersRegistry.pagination.previous")}
        nextLabel={t("customersRegistry.pagination.next")}
        canGoPrev={Boolean(model.data.page > 1)}
        canGoNext={Boolean(model.data.page < model.data.totalPages)}
        onPrev={model.handlePrevPage}
        onNext={model.handleNextPage}
      />
    </>
  );
};

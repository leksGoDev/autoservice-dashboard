import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import type { MechanicsRegistryModel } from "../hooks/use-mechanics-registry-model";
import { MechanicsAssignmentsCard } from "./MechanicsAssignmentsCard";
import { MechanicsAvailabilityCard } from "./MechanicsAvailabilityCard";
import { MechanicsRegistryTable } from "./MechanicsRegistryTable";

type MechanicsRegistryContentProps = {
  model: MechanicsRegistryModel;
};

export const MechanicsRegistryContent = ({ model }: MechanicsRegistryContentProps) => {
  const { t } = useI18n();

  if (model.isLoading) {
    return <DataState message={t("pages.mechanics.states.loading")} />;
  }

  if (model.isError) {
    return (
      <DataState
        tone="error"
        message={t("pages.mechanics.states.error")}
        action={
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 text-xs leading-4 font-medium text-[var(--color-text-primary)]"
            onClick={model.handleRetry}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (model.isEmpty || !model.listData) {
    return <DataState message={t("pages.mechanics.states.empty")} />;
  }

  return (
    <>
      <MechanicsRegistryTable
        rows={model.rows}
        page={model.listData.page}
        totalPages={model.listData.totalPages}
        summary={model.summary}
        canGoPrev={model.canGoPrev}
        canGoNext={model.canGoNext}
        onPrev={model.handlePrevPage}
        onNext={model.handleNextPage}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <MechanicsAvailabilityCard
          counts={model.availability.counts}
          averageUtilization={model.availability.averageUtilization}
        />
        <MechanicsAssignmentsCard leaders={model.assignmentLeaders} />
      </div>
    </>
  );
};

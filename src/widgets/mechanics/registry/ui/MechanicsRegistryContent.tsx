import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import type { MechanicsRegistryModel } from "../model/use-mechanics-registry-model";
import { MechanicsAssignmentsCard } from "./MechanicsAssignmentsCard";
import { MechanicsAvailabilityCard } from "./MechanicsAvailabilityCard";
import { MechanicsRegistryTable } from "./MechanicsRegistryTable";

type MechanicsRegistryContentProps = {
  model: MechanicsRegistryModel;
};

export const MechanicsRegistryContent = ({ model }: MechanicsRegistryContentProps) => {
  const { t } = useI18n();
  const isLoading = model.registryQuery.isLoading || model.workloadQuery.isLoading;
  const isError = model.registryQuery.isError || model.workloadQuery.isError;

  if (isLoading) {
    return <DataState message={t("pages.mechanics.states.loading")} />;
  }

  if (isError) {
    return (
      <DataState
        tone="error"
        message={t("pages.mechanics.states.error")}
        action={
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={model.handleRetry}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (model.rows.length === 0) {
    return <DataState message={t("pages.mechanics.states.empty")} />;
  }

  return (
    <>
      <MechanicsRegistryTable
        rows={model.rows}
        page={model.data?.page ?? 1}
        totalPages={model.data?.totalPages ?? 1}
        summary={model.summary}
        canGoPrev={model.canGoPrev}
        canGoNext={model.canGoNext}
        onPrev={() => model.setPage((value) => Math.max(1, value - 1))}
        onNext={() => model.setPage((value) => value + 1)}
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

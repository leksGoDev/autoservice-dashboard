import type { MechanicRegistryItem, MechanicWorkloadItem } from "@/entities/mechanic/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { MechanicsAssignmentsCard } from "./MechanicsAssignmentsCard";
import { MechanicsAvailabilityCard } from "./MechanicsAvailabilityCard";
import { MechanicsRegistryTable } from "./MechanicsRegistryTable";

type MechanicsRegistryContentProps = {
  isLoading: boolean;
  isError: boolean;
  rows: MechanicRegistryItem[];
  page: number;
  totalPages: number;
  summary: string;
  canGoPrev: boolean;
  canGoNext: boolean;
  availability: {
    counts: {
      available: number;
      busy: number;
      off_shift: number;
    };
    averageUtilization: number;
  };
  assignmentLeaders: MechanicWorkloadItem[];
  onRetry: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export const MechanicsRegistryContent = ({
  isLoading,
  isError,
  rows,
  page,
  totalPages,
  summary,
  canGoPrev,
  canGoNext,
  availability,
  assignmentLeaders,
  onRetry,
  onPrev,
  onNext,
}: MechanicsRegistryContentProps) => {
  const { t } = useI18n();

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
            onClick={onRetry}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (rows.length === 0) {
    return <DataState message={t("pages.mechanics.states.empty")} />;
  }

  return (
    <>
      <MechanicsRegistryTable
        rows={rows}
        page={page}
        totalPages={totalPages}
        summary={summary}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrev={onPrev}
        onNext={onNext}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <MechanicsAvailabilityCard
          counts={availability.counts}
          averageUtilization={availability.averageUtilization}
        />
        <MechanicsAssignmentsCard leaders={assignmentLeaders} />
      </div>
    </>
  );
};

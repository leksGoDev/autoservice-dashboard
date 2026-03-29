import type { AppointmentStatus } from "@/entities/appointment/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { useAppointmentOperationsModel } from "../model/use-appointment-operations-model";

type AppointmentOperationsControlsProps = {
  appointmentId: string;
  status: AppointmentStatus;
  scheduledFor: string;
  assignedMechanic: string;
  mechanics: string[];
};

export const AppointmentOperationsControls = ({
  appointmentId,
  status,
  scheduledFor,
  assignedMechanic,
  mechanics,
}: AppointmentOperationsControlsProps) => {
  const { t } = useI18n();
  const model = useAppointmentOperationsModel({
    appointmentId,
    status,
    scheduledFor,
    assignedMechanic,
    mechanics,
  });

  return (
    <div className="grid gap-2">
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input
          type="datetime-local"
          value={model.nextScheduledFor}
          onChange={(event) => model.setNextScheduledFor(event.target.value)}
          disabled={!model.canReschedule || model.isBusy}
          aria-label={t("pages.appointments.operations.scheduledFor") as string}
          className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
        />

        <select
          value={model.nextMechanic}
          onChange={(event) => model.setNextMechanic(event.target.value)}
          disabled={!model.canReschedule || model.isBusy}
          aria-label={t("pages.appointments.operations.mechanic") as string}
          className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
        >
          {model.availableMechanics.map((mechanic) => (
            <option key={mechanic} value={mechanic}>
              {mechanic}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-3 py-2 text-xs text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={model.handleReschedule}
          disabled={!model.canReschedule || !model.isRescheduleDirty || model.isBusy}
        >
          {model.rescheduleMutation.isPending
            ? t("pages.appointments.operations.actions.reschedulePending")
            : t("pages.appointments.operations.actions.reschedule")}
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.16)] px-3 py-2 text-xs text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={model.handleConfirm}
          disabled={!model.canConfirm || model.isBusy}
        >
          {model.confirmMutation.isPending
            ? t("pages.appointments.operations.actions.confirmPending")
            : t("pages.appointments.operations.actions.confirm")}
        </button>

        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.14)] px-3 py-2 text-xs text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={model.handleCancel}
          disabled={!model.canCancel || model.isBusy}
        >
          {model.cancelMutation.isPending
            ? t("pages.appointments.operations.actions.cancelPending")
            : t("pages.appointments.operations.actions.cancel")}
        </button>

        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.14)] px-3 py-2 text-xs text-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={model.handleConvert}
          disabled={!model.canConvert || model.isBusy}
        >
          {model.convertMutation.isPending
            ? t("pages.appointments.operations.actions.convertPending")
            : t("pages.appointments.operations.actions.convert")}
        </button>
      </div>

      {model.errorMessage ? <p className="m-0 text-xs text-[#fecaca]">{model.errorMessage}</p> : null}
      {model.successMessage ? <p className="m-0 text-xs text-emerald-300">{model.successMessage}</p> : null}
    </div>
  );
};

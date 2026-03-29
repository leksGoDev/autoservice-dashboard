import type { ChangeEvent } from "react";

import { APPOINTMENTS_FILTER_STATUSES } from "@/widgets/appointments/model/options";
import type { AppointmentsToolbarFilters } from "@/widgets/appointments/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";

type AppointmentsSchedulingToolbarProps = {
  filters: AppointmentsToolbarFilters;
  mechanics: string[];
  onChange: (next: Partial<AppointmentsToolbarFilters>) => void;
  onReset: () => void;
};

export const AppointmentsSchedulingToolbar = ({
  filters,
  mechanics,
  onChange,
  onReset,
}: AppointmentsSchedulingToolbarProps) => {
  const { t } = useI18n();

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ search: event.target.value });
  };

  const handleSelectChange =
    <T extends keyof Omit<AppointmentsToolbarFilters, "search">>(field: T) =>
    (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      onChange({ [field]: event.target.value } as Partial<AppointmentsToolbarFilters>);
    };

  return (
    <section
      className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4"
      aria-label={t("pages.appointments.toolbar.aria") as string}
    >
      <div className="grid gap-3 min-[1241px]:grid-cols-5 max-[1240px]:grid-cols-3 max-[767px]:grid-cols-1">
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.appointments.toolbar.search")}
          </span>
          <input
            type="search"
            className="w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-primary)]"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder={t("pages.appointments.toolbar.searchPlaceholder") as string}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.appointments.toolbar.status")}
          </span>
          <select
            className="w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-primary)]"
            value={filters.status}
            onChange={handleSelectChange("status")}
          >
            <option value="">{t("pages.appointments.toolbar.all")}</option>
            {APPOINTMENTS_FILTER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`appointment.status.${status}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.appointments.toolbar.mechanic")}
          </span>
          <select
            className="w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-primary)]"
            value={filters.mechanic}
            onChange={handleSelectChange("mechanic")}
          >
            <option value="">{t("pages.appointments.toolbar.all")}</option>
            {mechanics.map((mechanic) => (
              <option key={mechanic} value={mechanic}>
                {mechanic}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.appointments.toolbar.scheduledFrom")}
          </span>
          <input
            type="date"
            className="w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-primary)]"
            value={filters.scheduledFrom}
            onChange={handleSelectChange("scheduledFrom")}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {t("pages.appointments.toolbar.scheduledTo")}
          </span>
          <input
            type="date"
            className="w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-primary)]"
            value={filters.scheduledTo}
            onChange={handleSelectChange("scheduledTo")}
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-3 py-2 text-xs font-semibold text-[var(--color-text-primary)]"
          onClick={onReset}
        >
          {t("pages.appointments.toolbar.reset")}
        </button>
      </div>
    </section>
  );
};

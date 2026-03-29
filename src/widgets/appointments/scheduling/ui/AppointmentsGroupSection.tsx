import type { AppointmentListItem } from "@/entities/appointment/model/types";
import { AppointmentOperationsControls } from "@/features/appointment-operations/ui/AppointmentOperationsControls";
import { formatDateTime } from "@/shared/lib/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { getStatusBadgeClass } from "@/shared/ui/status-badges";

type AppointmentsGroupSectionProps = {
  title: string;
  emptyLabel: string;
  items: AppointmentListItem[];
  mechanics: string[];
};

export const AppointmentsGroupSection = ({
  title,
  emptyLabel,
  items,
  mechanics,
}: AppointmentsGroupSectionProps) => {
  const { locale, t } = useI18n();

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-[14px] pb-3">
      <header className="mb-3 flex items-center justify-between gap-3 border-b border-[rgba(154,164,178,0.12)] pb-2.5">
        <h2 className="m-0 text-base font-semibold">{title}</h2>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {t("pages.appointments.groups.count", { count: items.length })}
        </span>
      </header>

      {items.length === 0 ? (
        <p className="m-0 rounded-[10px] border border-dashed border-[rgba(154,164,178,0.35)] p-3 text-sm text-[var(--color-text-secondary)]">
          {emptyLabel}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.appointments.table.headers.number")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.appointments.table.headers.customer")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.appointments.table.headers.vehicle")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.appointments.table.headers.service")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.appointments.table.headers.status")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.appointments.table.headers.mechanic")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.appointments.table.headers.scheduledFor")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.appointments.table.headers.actions")}
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="align-top hover:bg-[#20283a]">
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 font-semibold">{item.number}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5">{item.customerName}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5">{item.vehicleLabel}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5">{item.serviceLabel}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5">
                    <span
                      className={`${getStatusBadgeClass(item.status)} inline-flex rounded-full px-2.5 py-[3px] text-[11px] font-semibold uppercase`}
                    >
                      {t(`appointment.status.${item.status}`)}
                    </span>
                  </td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5">{item.assignedMechanic}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5">
                    {formatDateTime(item.scheduledFor, locale, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5">
                    <AppointmentOperationsControls
                      appointmentId={item.id}
                      status={item.status}
                      scheduledFor={item.scheduledFor}
                      assignedMechanic={item.assignedMechanic}
                      mechanics={mechanics}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

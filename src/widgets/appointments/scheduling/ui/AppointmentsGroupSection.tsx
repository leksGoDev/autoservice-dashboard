import type { AppointmentListItem } from "@/entities/appointment/model/types";
import { AppointmentOperationsControls } from "@/features/appointment-operations/ui/AppointmentOperationsControls";
import { formatDateTime } from "@/shared/lib/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { getStatusBadgeClass } from "@/shared/ui/status-badges";
import { Link } from "react-router-dom";

const thClassName =
  "border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-left text-xs leading-4 font-semibold text-[var(--color-text-secondary)]";
const tdClassName = "border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 leading-5";
const relationLinkClass =
  "inline-flex rounded px-1 py-0.5 text-[var(--color-accent-light-blue)] underline decoration-transparent underline-offset-2 transition-colors hover:text-[#9ac0ff] hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,197,253,0.7)]";

const APPOINTMENTS_TABLE_HEADERS = [
  "number",
  "customer",
  "vehicle",
  "service",
  "status",
  "mechanic",
  "scheduledFor",
  "actions",
] as const;

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
    <section className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-3.5 pb-3">
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
        <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[860px] border-collapse text-[13px] leading-5 md:min-w-[980px]">
            <thead>
              <tr>
                {APPOINTMENTS_TABLE_HEADERS.map((header) => (
                  <th key={header} className={thClassName}>
                    {t(`pages.appointments.table.headers.${header}`)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="align-top hover:bg-[#20283a]">
                  <td className={`${tdClassName} whitespace-nowrap font-semibold`}>{item.number}</td>
                  <td className={tdClassName}>
                    <Link to={`/customers/${item.customerId}`} className={relationLinkClass}>
                      {item.customerName}
                    </Link>
                  </td>
                  <td className={tdClassName}>
                    <Link to={`/vehicles/${item.vehicleId}`} className={relationLinkClass}>
                      {item.vehicleLabel}
                    </Link>
                  </td>
                  <td className={tdClassName}>{item.serviceLabel}</td>
                  <td className={tdClassName}>
                    <span
                      className={`${getStatusBadgeClass(item.status)} inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase`}
                    >
                      {t(`appointment.status.${item.status}`)}
                    </span>
                  </td>
                  <td className={tdClassName}>{item.assignedMechanic}</td>
                  <td className={tdClassName}>
                    {formatDateTime(item.scheduledFor, locale, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className={`${tdClassName} min-w-[220px]`}>
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

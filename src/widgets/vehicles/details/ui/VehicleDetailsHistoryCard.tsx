import type { VehicleServiceHistoryItem } from "@/entities/vehicle/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { formatDate, formatUsd } from "@/shared/lib/presentation";
import { Link } from "react-router-dom";

type VehicleDetailsHistoryCardProps = {
  history: VehicleServiceHistoryItem[];
};

export const VehicleDetailsHistoryCard = ({ history }: VehicleDetailsHistoryCardProps) => {
  const { t } = useI18n();

  return (
    <article className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4">
      <h2 className="m-0 text-base font-bold">{t("pages.vehicleDetails.sections.history")}</h2>
      {history.length === 0 ? (
        <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.states.emptyHistory")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-left text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.history.order")}</th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.history.status")}</th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.history.total")}</th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.history.updated")}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.orderId} className="transition-colors hover:bg-[#20283a]">
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                    <Link
                      to={`/orders/${item.orderId}`}
                      className="inline-flex rounded-md border border-[rgba(107,164,255,0.46)] bg-[rgba(107,164,255,0.16)] px-2 py-1 font-mono text-[12px] font-semibold tracking-[0.02em] text-[#dbeafe] transition-colors hover:bg-[rgba(107,164,255,0.28)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,197,253,0.7)]"
                    >
                      {item.orderNumber}
                    </Link>
                  </td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{t(`order.status.${item.status}`)}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{formatUsd(item.totalAmount)}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{formatDate(item.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
};

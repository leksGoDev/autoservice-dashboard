import type { CustomerOrderHistoryItem } from "@/entities/customer/model/types";
import { formatCustomerDetailsCurrency, formatCustomerDetailsDate } from "@/entities/customer/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { Link } from "react-router-dom";

type CustomerOrdersTableProps = {
  rows: CustomerOrderHistoryItem[];
};

export const CustomerOrdersTable = ({ rows }: CustomerOrdersTableProps) => {
  const { t, locale } = useI18n();

  return (
    <article className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4">
      <h2 className="m-0 text-base font-bold">{t("pages.customerDetails.sections.orders")}</h2>
      {rows.length === 0 ? (
        <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.customerDetails.states.emptyOrders")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse text-left text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.customerDetails.orders.order")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.customerDetails.orders.vehicle")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.customerDetails.orders.status")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.customerDetails.orders.total")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.customerDetails.orders.updated")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[#20283a]">
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex rounded-md border border-[rgba(107,164,255,0.46)] bg-[rgba(107,164,255,0.16)] px-2 py-1 font-mono text-[12px] font-semibold tracking-[0.02em] text-[#dbeafe] transition-colors hover:bg-[rgba(107,164,255,0.28)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,197,253,0.7)]"
                    >
                      {order.number}
                    </Link>
                  </td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{order.vehicleLabel}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                    {t(`order.status.${order.status}`)}
                  </td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                    {formatCustomerDetailsCurrency(order.totalAmount, locale)}
                  </td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                    {formatCustomerDetailsDate(order.updatedAt, locale, t("common.unknown"))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
};

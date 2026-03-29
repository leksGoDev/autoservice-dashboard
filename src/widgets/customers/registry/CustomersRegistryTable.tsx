import { Link } from "react-router-dom";

import type { CustomerListItem } from "@/entities/customer/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";

import { formatCustomersRegistryDate } from "./model";

type CustomersRegistryTableProps = {
  rows: CustomerListItem[];
};

export const CustomersRegistryTable = ({ rows }: CustomersRegistryTableProps) => {
  const { t, locale } = useI18n();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[760px] w-full border-collapse text-left text-[13px]">
        <thead>
          <tr>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {t("customersRegistry.table.name")}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {t("customersRegistry.table.phone")}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {t("customersRegistry.table.email")}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {t("customersRegistry.table.vehiclesCount")}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {t("customersRegistry.table.ordersCount")}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {t("customersRegistry.table.lastVisit")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((customer) => (
            <tr key={customer.id} className="transition-colors hover:bg-[#20283a]">
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                <Link
                  to={`/customers/${customer.id}`}
                  className="inline-flex rounded-md border border-[rgba(107,164,255,0.46)] bg-[rgba(107,164,255,0.16)] px-2 py-1 text-[12px] font-semibold tracking-[0.01em] text-[#dbeafe] transition-colors hover:bg-[rgba(107,164,255,0.28)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,197,253,0.7)]"
                >
                  {customer.fullName}
                </Link>
              </td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{customer.phone}</td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{customer.email}</td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                {customer.vehiclesCount}
              </td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{customer.ordersCount}</td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                {formatCustomersRegistryDate(customer.lastVisitAt, locale, t("common.unknown"))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

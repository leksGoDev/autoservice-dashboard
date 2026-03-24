import { Link } from "react-router-dom";

import type { CustomerListItem } from "@/entities/customer/model/types";
import type { AppLocale } from "@/shared/i18n/config";

import { formatCustomersRegistryDate } from "./model";

type CustomersRegistryTableProps = {
  rows: CustomerListItem[];
  locale: AppLocale;
  unknownLabel: string;
  detailsLabel: string;
  headers: {
    name: string;
    phone: string;
    email: string;
    vehiclesCount: string;
    ordersCount: string;
    lastVisit: string;
  };
};

export const CustomersRegistryTable = ({
  rows,
  locale,
  unknownLabel,
  detailsLabel,
  headers,
}: CustomersRegistryTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[760px] w-full border-collapse text-left text-[13px]">
        <thead>
          <tr>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {headers.name}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {headers.phone}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {headers.email}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {headers.vehiclesCount}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {headers.ordersCount}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
              {headers.lastVisit}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((customer) => (
            <tr key={customer.id} className="transition-colors hover:bg-[#20283a]">
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                <div className="grid gap-[3px]">
                  <span>{customer.fullName}</span>
                  <Link
                    to={`/customers/${customer.id}`}
                    className="cursor-pointer border-0 bg-transparent p-0 text-left text-[12px] text-[var(--color-accent-light-blue)] transition-colors hover:text-[#9ac0ff]"
                  >
                    {detailsLabel}
                  </Link>
                </div>
              </td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{customer.phone}</td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{customer.email}</td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                {customer.vehiclesCount}
              </td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{customer.ordersCount}</td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                {formatCustomersRegistryDate(customer.lastVisitAt, locale, unknownLabel)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

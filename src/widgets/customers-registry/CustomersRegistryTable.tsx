import type { FC } from "react";

import type { AppLocale } from "@/shared/i18n/config";

import { formatCustomersRegistryDate, type CustomerRegistryRow } from "./model";

interface CustomersRegistryTableProps {
  rows: CustomerRegistryRow[];
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
}

export const CustomersRegistryTable: FC<CustomersRegistryTableProps> = ({
  rows,
  locale,
  unknownLabel,
  detailsLabel,
  headers,
}) => {
  return (
    <div className="customers-registry__table-wrap">
      <table className="customers-registry__table">
        <thead>
          <tr>
            <th>{headers.name}</th>
            <th>{headers.phone}</th>
            <th>{headers.email}</th>
            <th>{headers.vehiclesCount}</th>
            <th>{headers.ordersCount}</th>
            <th>{headers.lastVisit}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((customer) => (
            <tr key={customer.id}>
              <td>
                <div className="customers-registry__name-cell">
                  <span>{customer.fullName}</span>
                  <button type="button" className="customers-registry__row-link">
                    {detailsLabel}
                  </button>
                </div>
              </td>
              <td>{customer.phone}</td>
              <td>{customer.email}</td>
              <td>{customer.vehiclesCount}</td>
              <td>{customer.ordersCount}</td>
              <td>{formatCustomersRegistryDate(customer.lastVisitAt, locale, unknownLabel)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

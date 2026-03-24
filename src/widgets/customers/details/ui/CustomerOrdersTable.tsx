import type { CustomerOrderHistoryItem } from "@/entities/customer/model/types";

type CustomerOrdersTableProps = {
  sectionTitle: string;
  emptyLabel: string;
  rows: CustomerOrderHistoryItem[];
  headers: {
    order: string;
    vehicle: string;
    status: string;
    total: string;
    updated: string;
  };
  getOrderStatusLabel: (status: CustomerOrderHistoryItem["status"]) => string;
  formatAmount: (amount: number) => string;
  formatUpdatedAt: (updatedAt: string) => string;
};

export const CustomerOrdersTable = ({
  sectionTitle,
  emptyLabel,
  rows,
  headers,
  getOrderStatusLabel,
  formatAmount,
  formatUpdatedAt,
}: CustomerOrdersTableProps) => {
  return (
    <article className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4">
      <h2 className="m-0 text-base font-bold">{sectionTitle}</h2>
      {rows.length === 0 ? (
        <p className="m-0 text-[var(--color-text-secondary)]">{emptyLabel}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse text-left text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {headers.order}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {headers.vehicle}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {headers.status}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {headers.total}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {headers.updated}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[#20283a]">
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle font-mono text-[13px] text-[#c9d1dd]">
                    {order.number}
                  </td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{order.vehicleLabel}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                    {getOrderStatusLabel(order.status)}
                  </td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                    {formatAmount(order.totalAmount)}
                  </td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
                    {formatUpdatedAt(order.updatedAt)}
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

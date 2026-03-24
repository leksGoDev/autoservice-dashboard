import type { OrderPartItem } from "@/entities/order/model/types";
import { formatOrderCurrency } from "@/entities/order/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";

type OrderDetailsPartsTableProps = {
  parts: OrderPartItem[];
};

export const OrderDetailsPartsTable = ({ parts }: OrderDetailsPartsTableProps) => {
  const { t } = useI18n();

  if (parts.length === 0) {
    return (
      <p className="m-0 text-sm text-[var(--color-text-secondary)]">{t("pages.orderDetails.states.emptyParts")}</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
        <thead>
          <tr>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              {t("pages.orderDetails.parts.headers.name")}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              {t("pages.orderDetails.parts.headers.job")}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              {t("pages.orderDetails.parts.headers.quantity")}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              {t("pages.orderDetails.parts.headers.unitPrice")}
            </th>
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              {t("pages.orderDetails.parts.headers.totalPrice")}
            </th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part.id} className="transition-colors hover:bg-[#20283a]">
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{part.name}</td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle text-[var(--color-text-secondary)]">
                {part.jobName}
              </td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{part.quantity}</td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{formatOrderCurrency(part.unitPrice)}</td>
              <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{formatOrderCurrency(part.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

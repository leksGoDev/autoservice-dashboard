import { useCallback } from "react";

import type { OrderPartItem } from "@/entities/order/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import type { ServicePartsControlsModel } from "../../model/use-service-parts-model";
import { PartsTableRow } from "./PartsTableRow";

type PartsTableProps = {
  parts: OrderPartItem[];
  model: ServicePartsControlsModel;
};

export const PartsTable = ({ parts, model }: PartsTableProps) => {
  const { t } = useI18n();

  const handleQuantityChange = useCallback(
    (partId: string, quantity: string) => {
      model.setPartQuantities((prev) => ({
        ...prev,
        [partId]: quantity,
      }));
    },
    [model.setPartQuantities],
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
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
            <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              {t("pages.orderDetails.controls.parts.headers.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <PartsTableRow
              key={part.id}
              part={part}
              quantityValue={model.partQuantities[part.id] ?? String(part.quantity)}
              isBusy={model.isBusy}
              isUpdateQuantityPending={model.updatePartQuantityMutation.isPending}
              isRemovePending={model.removePartMutation.isPending}
              onQuantityChange={handleQuantityChange}
              onUpdatePartQuantity={model.handleUpdatePartQuantity}
              onRemovePart={model.handleRemovePart}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

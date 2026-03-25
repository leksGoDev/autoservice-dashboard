import { memo, useCallback } from "react";

import type { OrderPartItem } from "@/entities/order/model/types";
import { formatOrderCurrency } from "@/entities/order/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import type { ServicePartsControlsModel } from "../../model/use-service-parts-controls-model";

type PartsTableProps = {
  parts: OrderPartItem[];
  model: ServicePartsControlsModel;
};

type PartRowProps = {
  part: OrderPartItem;
  quantityValue: string;
  isBusy: boolean;
  isUpdateQuantityPending: boolean;
  isRemovePending: boolean;
  onQuantityChange: (partId: string, quantity: string) => void;
  onUpdatePartQuantity: (partId: string, quantity: number) => void;
  onRemovePart: (partId: string) => void;
};

const PartRow = memo(
  ({
    part,
    quantityValue,
    isBusy,
    isUpdateQuantityPending,
    isRemovePending,
    onQuantityChange,
    onUpdatePartQuantity,
    onRemovePart,
  }: PartRowProps) => {
    const { t } = useI18n();

    return (
      <tr className="transition-colors hover:bg-[#20283a]">
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{part.name}</td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle text-[var(--color-text-secondary)]">
          {part.jobName}
        </td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{part.quantity}</td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{formatOrderCurrency(part.unitPrice)}</td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{formatOrderCurrency(part.totalPrice)}</td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">
          <div className="flex flex-wrap gap-2">
            <input
              type="number"
              min="1"
              step="1"
              value={quantityValue}
              onChange={(event) => onQuantityChange(part.id, event.target.value)}
              disabled={isBusy}
              aria-label={`${t("pages.orderDetails.controls.parts.row.quantity")} ${part.name}`}
              className="w-18 rounded-[8px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
            />

            <button
              type="button"
              className="cursor-pointer rounded-[8px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-2 py-1.5 text-xs text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => onUpdatePartQuantity(part.id, Number(quantityValue))}
              disabled={isBusy || quantityValue === String(part.quantity)}
            >
              {isUpdateQuantityPending
                ? t("pages.orderDetails.controls.parts.actions.quantityPending")
                : t("pages.orderDetails.controls.parts.actions.quantity")}
            </button>

            <button
              type="button"
              className="cursor-pointer rounded-[8px] border border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.12)] px-2 py-1.5 text-xs text-[#fecaca] disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => onRemovePart(part.id)}
              disabled={isBusy}
            >
              {isRemovePending
                ? t("pages.orderDetails.controls.parts.actions.removePending")
                : t("pages.orderDetails.controls.parts.actions.remove")}
            </button>
          </div>
        </td>
      </tr>
    );
  },
);

PartRow.displayName = "PartRow";

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
            <PartRow
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

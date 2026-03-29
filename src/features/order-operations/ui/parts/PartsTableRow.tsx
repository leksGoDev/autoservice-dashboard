import { memo } from "react";

import type { OrderPartItem } from "@/entities/order/model/types";
import { formatOrderCurrency } from "@/entities/order/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";

export type PartsTableRowProps = {
  part: OrderPartItem;
  quantityValue: string;
  isBusy: boolean;
  isUpdateQuantityPending: boolean;
  isRemovePending: boolean;
  onQuantityChange: (partId: string, quantity: string) => void;
  onUpdatePartQuantity: (partId: string, quantity: number) => void;
  onRemovePart: (partId: string) => void;
};

export const PartsTableRow = memo(
  ({
    part,
    quantityValue,
    isBusy,
    isUpdateQuantityPending,
    isRemovePending,
    onQuantityChange,
    onUpdatePartQuantity,
    onRemovePart,
  }: PartsTableRowProps) => {
    const { t } = useI18n();

    return (
      <tr className="transition-colors hover:bg-[#20283a]">
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{part.name}</td>
        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle text-[color:var(--color-text-secondary)]">
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
              className="w-18 rounded-[8px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2 py-1.5 text-xs text-[color:var(--color-text-primary)]"
            />

            {quantityValue !== String(part.quantity) ? (
              <button
                type="button"
                className="grid h-7 w-7 cursor-pointer place-items-center rounded-[8px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] text-[13px] font-semibold text-[color:var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => onUpdatePartQuantity(part.id, Number(quantityValue))}
                disabled={isBusy}
                aria-label={
                  isUpdateQuantityPending
                    ? String(t("pages.orderDetails.controls.parts.actions.quantityPending"))
                    : String(t("pages.orderDetails.controls.parts.actions.quantity"))
                }
                title={
                  isUpdateQuantityPending
                    ? String(t("pages.orderDetails.controls.parts.actions.quantityPending"))
                    : String(t("pages.orderDetails.controls.parts.actions.quantity"))
                }
              >
                <span aria-hidden="true">✓</span>
              </button>
            ) : null}

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

PartsTableRow.displayName = "PartsTableRow";

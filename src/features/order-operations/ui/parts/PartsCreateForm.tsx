import { useI18n } from "@/shared/i18n/use-i18n";
import type { ServicePartsControlsModel } from "../../model/use-service-parts-model";

type PartsCreateFormProps = {
  model: ServicePartsControlsModel;
};

export const PartsCreateForm = ({ model }: PartsCreateFormProps) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-2 rounded-xl border border-[rgba(154,164,178,0.12)] bg-[rgba(15,17,21,0.38)] p-3 sm:grid-cols-2 xl:grid-cols-5">
      <label className="grid gap-1">
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
          {t("pages.orderDetails.controls.parts.add.name")}
        </span>
        <input
          value={model.partName}
          onChange={(event) => model.setPartName(event.target.value)}
          disabled={model.isBusy}
          className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
          aria-label={t("pages.orderDetails.controls.parts.add.name") as string}
        />
      </label>

      <label className="grid gap-1">
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
          {t("pages.orderDetails.controls.parts.add.job")}
        </span>
        <select
          value={model.partJobId}
          onChange={(event) => model.setPartJobId(event.target.value)}
          disabled={model.isBusy}
          className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
          aria-label={t("pages.orderDetails.controls.parts.add.job") as string}
        >
          {model.jobOptions.map((jobOption) => (
            <option key={jobOption.id} value={jobOption.id}>
              {jobOption.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
          {t("pages.orderDetails.controls.parts.add.quantity")}
        </span>
        <input
          type="number"
          min="1"
          step="1"
          value={model.partQuantity}
          onChange={(event) => model.setPartQuantity(event.target.value)}
          disabled={model.isBusy}
          className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
          aria-label={t("pages.orderDetails.controls.parts.add.quantity") as string}
        />
      </label>

      <label className="grid gap-1">
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
          {t("pages.orderDetails.controls.parts.add.unitPrice")}
        </span>
        <input
          type="number"
          min="1"
          step="1"
          value={model.partUnitPrice}
          onChange={(event) => model.setPartUnitPrice(event.target.value)}
          disabled={model.isBusy}
          className="rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.62)] px-2.5 py-2 text-xs text-[var(--color-text-primary)]"
          aria-label={t("pages.orderDetails.controls.parts.add.unitPrice") as string}
        />
      </label>

      <button
        type="button"
        className="mt-auto cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.38)] bg-[rgba(107,164,255,0.16)] px-3 py-2 text-xs text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
        onClick={model.handleAddPart}
        disabled={model.isBusy || model.jobOptions.length === 0}
      >
        {model.addPartMutation.isPending
          ? t("pages.orderDetails.controls.parts.actions.addPending")
          : t("pages.orderDetails.controls.parts.actions.add")}
      </button>
    </div>
  );
};

import type { OrderPartItem, OrderServiceJob } from "@/entities/order/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { useServicePartsControlsModel } from "../model/use-service-parts-model";
import { PartsCreateForm } from "./parts/PartsCreateForm";
import { PartsTable } from "./parts/PartsTable";

type ServicePartsWorkspaceProps = {
  orderId: string;
  jobs: OrderServiceJob[];
  parts: OrderPartItem[];
};

export const ServicePartsWorkspace = ({ orderId, jobs, parts }: ServicePartsWorkspaceProps) => {
  const { t } = useI18n();
  const model = useServicePartsControlsModel({
    orderId,
    jobs,
    parts,
  });

  return (
    <div className="grid gap-4">
      <PartsCreateForm
        model={model}
      />

      <PartsTable
        parts={parts}
        model={model}
      />

      {parts.length === 0 ? (
        <p className="m-0 text-sm text-[var(--color-text-secondary)]">{t("pages.orderDetails.states.emptyParts")}</p>
      ) : null}
      {model.errorMessage ? <p className="m-0 text-xs text-[#fecaca]">{model.errorMessage}</p> : null}
      {model.successMessage ? <p className="m-0 text-xs text-emerald-300">{model.successMessage}</p> : null}
    </div>
  );
};

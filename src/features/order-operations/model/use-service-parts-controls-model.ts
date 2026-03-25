import { useEffect, useMemo, useState } from "react";

import type { OrderPartItem, OrderServiceJob } from "@/entities/order/model/types";
import {
  useAddJobPartMutation,
  useRemoveJobPartMutation,
  useUpdateJobPartQuantityMutation,
} from "@/features/order-operations/api/mutations";
import { useI18n } from "@/shared/i18n/use-i18n";
import { getMutationErrorMessage } from "./get-mutation-error-message";

type PartsSuccessKey = "partAdded" | "partQuantityUpdated" | "partRemoved";

type UseServicePartsControlsModelParams = {
  orderId: string;
  jobs: OrderServiceJob[];
  parts: OrderPartItem[];
};

export const useServicePartsControlsModel = ({
  orderId,
  jobs,
  parts,
}: UseServicePartsControlsModelParams) => {
  const { t } = useI18n();

  const [partName, setPartName] = useState("");
  const [partJobId, setPartJobId] = useState("");
  const [partQuantity, setPartQuantity] = useState("1");
  const [partUnitPrice, setPartUnitPrice] = useState("35");
  const [partQuantities, setPartQuantities] = useState<Record<string, string>>({});
  const [lastSuccessKey, setLastSuccessKey] = useState<PartsSuccessKey | null>(null);

  const addPartMutation = useAddJobPartMutation();
  const updatePartQuantityMutation = useUpdateJobPartQuantityMutation();
  const removePartMutation = useRemoveJobPartMutation();

  useEffect(() => {
    if (!partJobId && jobs.length > 0) {
      setPartJobId(jobs[0].id);
    }
  }, [jobs, partJobId]);

  useEffect(() => {
    const quantities: Record<string, string> = {};

    parts.forEach((part) => {
      quantities[part.id] = String(part.quantity);
    });

    setPartQuantities(quantities);
  }, [parts]);

  const jobOptions = useMemo(
    () =>
      jobs.map((job) => ({
        id: job.id,
        name: job.name,
      })),
    [jobs],
  );

  const resetFeedback = () => {
    setLastSuccessKey(null);
    addPartMutation.reset();
    updatePartQuantityMutation.reset();
    removePartMutation.reset();
  };

  const handleAddPart = async () => {
    resetFeedback();

    const name = partName.trim();
    const quantity = Number(partQuantity);
    const unitPrice = Number(partUnitPrice);

    if (!name || !partJobId || !Number.isInteger(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice <= 0) {
      return;
    }

    try {
      await addPartMutation.mutateAsync({
        orderId,
        jobId: partJobId,
        payload: {
          name,
          quantity,
          unitPrice,
        },
      });

      setLastSuccessKey("partAdded");
      setPartName("");
      setPartQuantity("1");
      setPartUnitPrice("35");
    } catch {
      // Mutation error is handled by query state and rendered from model.
    }
  };

  const handleUpdatePartQuantity = async (partId: string) => {
    resetFeedback();

    const quantity = Number(partQuantities[partId]);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return;
    }

    try {
      await updatePartQuantityMutation.mutateAsync({
        orderId,
        jobPartId: partId,
        quantity,
      });
      setLastSuccessKey("partQuantityUpdated");
    } catch {
      // Mutation error is handled by query state and rendered from model.
    }
  };

  const handleRemovePart = async (partId: string) => {
    resetFeedback();

    try {
      await removePartMutation.mutateAsync({
        orderId,
        jobPartId: partId,
      });
      setLastSuccessKey("partRemoved");
    } catch {
      // Mutation error is handled by query state and rendered from model.
    }
  };

  const isBusy = addPartMutation.isPending || updatePartQuantityMutation.isPending || removePartMutation.isPending;
  const currentError = addPartMutation.error ?? updatePartQuantityMutation.error ?? removePartMutation.error;
  const errorMessage = currentError
    ? getMutationErrorMessage(currentError, t("pages.orderDetails.controls.errors.partsFallback") as string)
    : null;

  const successMessage =
    lastSuccessKey === "partAdded"
      ? t("pages.orderDetails.controls.success.partAdded")
      : lastSuccessKey === "partQuantityUpdated"
        ? t("pages.orderDetails.controls.success.partQuantityUpdated")
        : lastSuccessKey === "partRemoved"
          ? t("pages.orderDetails.controls.success.partRemoved")
          : null;

  return {
    partName,
    setPartName,
    partJobId,
    setPartJobId,
    partQuantity,
    setPartQuantity,
    partUnitPrice,
    setPartUnitPrice,
    partQuantities,
    setPartQuantities,
    jobOptions,
    isBusy,
    addPartMutation,
    updatePartQuantityMutation,
    removePartMutation,
    handleAddPart,
    handleUpdatePartQuantity,
    handleRemovePart,
    errorMessage,
    successMessage,
  };
};

export type ServicePartsControlsModel = ReturnType<typeof useServicePartsControlsModel>;

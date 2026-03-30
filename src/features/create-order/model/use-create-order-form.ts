import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { getMutationErrorMessage } from "@/features/order-operations/model/get-mutation-error-message";
import { useCreateOrderFlowMutation } from "../api/mutations";
import { useCreateOrderBootstrapQuery } from "../api/queries";
import {
  createOrderFormSchema,
  type CreateOrderFormInput,
  type CreateOrderFormValues,
} from "./schema";
import { createOrderFormDefaultValues, toCreateOrderFlowInput } from "./form";

export function useCreateOrderFormModel() {
  const navigate = useNavigate();
  const createFlowMutation = useCreateOrderFlowMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<CreateOrderFormInput, unknown, CreateOrderFormValues>({
    resolver: zodResolver(createOrderFormSchema),
    defaultValues: createOrderFormDefaultValues(),
    mode: "onTouched",
  });

  const jobsFieldArray = useFieldArray({
    control: form.control,
    name: "initialJobs",
  });

  const customerMode = form.watch("customerMode");
  const vehicleMode = form.watch("vehicleMode");
  const selectedCustomerId = form.watch("existingCustomerId");
  const shouldLoadVehicles = customerMode === "existing" && Boolean(selectedCustomerId);
  const shouldLoadMechanics = customerMode === "new" || Boolean(selectedCustomerId);
  const bootstrapQuery = useCreateOrderBootstrapQuery({ shouldLoadVehicles, shouldLoadMechanics });
  const customers = bootstrapQuery.customers;
  const vehicles = bootstrapQuery.vehicles;
  const mechanics = bootstrapQuery.mechanics;

  const filteredVehicles = useMemo(() => {
    if (!selectedCustomerId) {
      return [];
    }

    return vehicles.filter((vehicle) => vehicle.customerId === selectedCustomerId);
  }, [selectedCustomerId, vehicles]);

  useEffect(() => {
    if (customerMode === "new" && vehicleMode !== "new") {
      form.setValue("vehicleMode", "new");
    }
  }, [customerMode, vehicleMode, form]);

  useEffect(() => {
    const existingVehicleId = form.getValues("existingVehicleId");

    if (!existingVehicleId) {
      return;
    }

    if (customerMode !== "existing" || !selectedCustomerId) {
      form.setValue("existingVehicleId", "");
      return;
    }

    const selectedVehicle = vehicles.find((vehicle) => vehicle.id === existingVehicleId);
    if (!selectedVehicle || selectedVehicle.customerId !== selectedCustomerId) {
      form.setValue("existingVehicleId", "");
    }
  }, [customerMode, selectedCustomerId, vehicles, form]);

  const submit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (values.customerMode === "existing" && values.vehicleMode === "existing") {
        const selectedVehicle = vehicles.find((vehicle) => vehicle.id === values.existingVehicleId);

        if (selectedVehicle && selectedVehicle.customerId !== values.existingCustomerId) {
          throw new Error("Selected vehicle belongs to another customer");
        }
      }

      if (values.customerMode === "new" && values.vehicleMode === "existing") {
        throw new Error("New customer requires creating a new vehicle");
      }

      const createdOrder = await createFlowMutation.mutateAsync(toCreateOrderFlowInput(values));

      setSubmitSuccess(true);

      window.setTimeout(() => {
        navigate(`/orders/${createdOrder.id}`);
      }, 450);
    } catch (error) {
      setSubmitError(getMutationErrorMessage(error, "Failed to create order"));
    }
  });

  return {
    form,
    submit,
    jobsFieldArray,
    customerMode,
    vehicleMode,
    selectedCustomerId,
    customers,
    vehicles: filteredVehicles,
    canSelectExistingVehicle: customerMode === "existing" && Boolean(selectedCustomerId),
    isVehiclesLoading: bootstrapQuery.isVehiclesLoading,
    mechanics,
    isMechanicsLoading: bootstrapQuery.isMechanicsLoading,
    submitError,
    submitSuccess,
    hasBootstrapError: bootstrapQuery.hasError,
    isBootstrapLoading: bootstrapQuery.isLoading,
    isSubmitting: createFlowMutation.isPending,
    refetchBootstrap: bootstrapQuery.refetch,
  };
}

export type CreateOrderFormHandle = UseFormReturn<CreateOrderFormInput, unknown, CreateOrderFormValues>;

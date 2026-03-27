import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { useCustomersListQuery } from "@/entities/customer/api/queries";
import { useMechanicsRegistryQuery } from "@/entities/mechanic/api/queries";
import { useVehiclesListQuery } from "@/entities/vehicle/api/queries";
import { getMutationErrorMessage } from "@/features/order-operations/model/get-mutation-error-message";
import { useCreateOrderFlowMutation } from "../api/mutations";
import {
  createOrderFormSchema,
  type CreateOrderFormInput,
  type CreateOrderFormValues,
} from "./schema";

function toDateTimeInputValue() {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const defaultValues: CreateOrderFormInput = {
  customerMode: "existing",
  existingCustomerId: "",
  newCustomerFullName: "",
  newCustomerPhone: "",
  newCustomerEmail: "",
  newCustomerLoyaltyTier: "standard",
  vehicleMode: "existing",
  existingVehicleId: "",
  newVehicleVin: "",
  newVehiclePlateNumber: "",
  newVehicleMake: "",
  newVehicleModel: "",
  newVehicleYear: new Date().getFullYear(),
  scheduledFor: toDateTimeInputValue(),
  complaint: "",
  notes: "",
  assignedMechanic: "",
  priority: "medium",
  status: "scheduled",
  initialJobs: [
    {
      name: "",
      category: "",
      estimatedHours: 1,
      laborPrice: 100,
      assignedMechanic: "",
    },
  ],
};

export function useCreateOrderFormModel() {
  const navigate = useNavigate();
  const createFlowMutation = useCreateOrderFlowMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<CreateOrderFormInput, unknown, CreateOrderFormValues>({
    resolver: zodResolver(createOrderFormSchema),
    defaultValues,
    mode: "onTouched",
  });

  const jobsFieldArray = useFieldArray({
    control: form.control,
    name: "initialJobs",
  });

  const customersQuery = useCustomersListQuery({
    page: 1,
    pageSize: 100,
  });
  const vehiclesQuery = useVehiclesListQuery({
    page: 1,
    pageSize: 200,
  });
  const mechanicsQuery = useMechanicsRegistryQuery({
    page: 1,
    pageSize: 100,
  });

  const customerMode = form.watch("customerMode");
  const vehicleMode = form.watch("vehicleMode");
  const selectedCustomerId = form.watch("existingCustomerId");
  const customers = customersQuery.data?.items ?? [];
  const vehicles = vehiclesQuery.data?.items ?? [];

  const filteredVehicles = useMemo(() => {
    if (customerMode !== "existing" || !selectedCustomerId) {
      return vehicles;
    }

    return vehicles.filter((vehicle) => vehicle.customerId === selectedCustomerId);
  }, [customerMode, selectedCustomerId, vehicles]);

  const mechanics = useMemo(
    () => [...new Set((mechanicsQuery.data?.items ?? []).map((item) => item.name))].sort((a, b) => a.localeCompare(b)),
    [mechanicsQuery.data?.items],
  );

  const hasBootstrapError = customersQuery.isError || vehiclesQuery.isError || mechanicsQuery.isError;
  const isBootstrapLoading = customersQuery.isLoading || vehiclesQuery.isLoading || mechanicsQuery.isLoading;

  useEffect(() => {
    form.setValue("existingVehicleId", "");

    if (customerMode === "new" && vehicleMode !== "new") {
      form.setValue("vehicleMode", "new");
    }
  }, [customerMode, vehicleMode, form]);

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

      const createdOrder = await createFlowMutation.mutateAsync({
        customer:
          values.customerMode === "existing"
            ? {
                mode: "existing",
                customerId: values.existingCustomerId,
              }
            : {
                mode: "new",
                fullName: values.newCustomerFullName,
                phone: values.newCustomerPhone,
                email: values.newCustomerEmail,
                loyaltyTier: values.newCustomerLoyaltyTier,
              },
        vehicle:
          values.vehicleMode === "existing"
            ? {
                mode: "existing",
                vehicleId: values.existingVehicleId,
              }
            : {
                mode: "new",
                vin: values.newVehicleVin,
                plateNumber: values.newVehiclePlateNumber,
                make: values.newVehicleMake,
                model: values.newVehicleModel,
                year: values.newVehicleYear,
              },
        scheduledFor: new Date(values.scheduledFor).toISOString(),
        complaint: values.complaint,
        notes: values.notes,
        priority: values.priority,
        status: values.status,
        assignedMechanic: values.assignedMechanic,
        initialJobs: values.initialJobs.map((job) => ({
          name: job.name,
          category: job.category,
          estimatedHours: Number(job.estimatedHours),
          laborPrice: Number(job.laborPrice),
          assignedMechanic: job.assignedMechanic?.trim() ? job.assignedMechanic.trim() : undefined,
        })),
      });

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
    customers,
    vehicles: filteredVehicles,
    mechanics,
    submitError,
    submitSuccess,
    hasBootstrapError,
    isBootstrapLoading,
    isSubmitting: createFlowMutation.isPending,
    refetchBootstrap: () => {
      customersQuery.refetch();
      vehiclesQuery.refetch();
      mechanicsQuery.refetch();
    },
  };
}

export type CreateOrderFormHandle = UseFormReturn<CreateOrderFormInput, unknown, CreateOrderFormValues>;

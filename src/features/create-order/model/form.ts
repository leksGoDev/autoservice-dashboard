import type { CreateOrderFormInput, CreateOrderFormValues } from "./schema";
import type { CreateOrderFlowInput } from "./types";

function toDateTimeInputValue(now = new Date()) {
  const nextHour = new Date(now);
  nextHour.setMinutes(0, 0, 0);
  nextHour.setHours(nextHour.getHours() + 1);

  const year = nextHour.getFullYear();
  const month = String(nextHour.getMonth() + 1).padStart(2, "0");
  const day = String(nextHour.getDate()).padStart(2, "0");
  const hours = String(nextHour.getHours()).padStart(2, "0");
  const minutes = String(nextHour.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function createOrderFormDefaultValues(): CreateOrderFormInput {
  return {
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
}

export function toCreateOrderFlowInput(values: CreateOrderFormValues): CreateOrderFlowInput {
  return {
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
  };
}

import { z } from "zod";

import { ORDER_PRIORITIES, ORDER_STATUSES } from "@/entities/order/model/options";

const initialServiceJobSchema = z.object({
  name: z.string().trim().min(1, "Job name is required"),
  category: z.string().trim().min(1, "Category is required"),
  estimatedHours: z.coerce.number().positive("Estimated hours must be greater than 0"),
  laborPrice: z.coerce.number().positive("Labor price must be greater than 0"),
  assignedMechanic: z.string().trim().optional(),
});

export const createOrderFormSchema = z
  .object({
    customerMode: z.enum(["existing", "new"]),
    existingCustomerId: z.string().trim(),
    newCustomerFullName: z.string().trim(),
    newCustomerPhone: z.string().trim(),
    newCustomerEmail: z.string().trim(),
    newCustomerLoyaltyTier: z.enum(["standard", "silver", "gold"]),
    vehicleMode: z.enum(["existing", "new"]),
    existingVehicleId: z.string().trim(),
    newVehicleVin: z.string().trim(),
    newVehiclePlateNumber: z.string().trim(),
    newVehicleMake: z.string().trim(),
    newVehicleModel: z.string().trim(),
    newVehicleYear: z.coerce.number().int().min(1980).max(2100),
    scheduledFor: z
      .string()
      .trim()
      .min(1, "Scheduled date and time is required")
      .refine((value) => !Number.isNaN(new Date(value).getTime()), "Scheduled date and time is invalid"),
    complaint: z.string().trim().min(5, "Complaint is required"),
    notes: z.string().trim(),
    assignedMechanic: z.string().trim().min(1, "Mechanic is required"),
    priority: z.enum(ORDER_PRIORITIES),
    status: z.enum(ORDER_STATUSES),
    initialJobs: z.array(initialServiceJobSchema).min(1, "Add at least one initial service job"),
  })
  .refine((values) => values.customerMode !== "existing" || Boolean(values.existingCustomerId), {
    path: ["existingCustomerId"],
    message: "Select a customer",
  })
  .refine((values) => values.customerMode !== "new" || Boolean(values.newCustomerFullName), {
    path: ["newCustomerFullName"],
    message: "Customer full name is required",
  })
  .refine((values) => values.customerMode !== "new" || Boolean(values.newCustomerPhone), {
    path: ["newCustomerPhone"],
    message: "Customer phone is required",
  })
  .refine((values) => values.customerMode !== "new" || z.string().email().safeParse(values.newCustomerEmail).success, {
    path: ["newCustomerEmail"],
    message: "Valid customer email is required",
  })
  .refine((values) => values.customerMode !== "new" || values.vehicleMode === "new", {
    path: ["vehicleMode"],
    message: "New customer requires creating a new vehicle",
  })
  .refine((values) => values.vehicleMode !== "existing" || Boolean(values.existingVehicleId), {
    path: ["existingVehicleId"],
    message: "Select a vehicle",
  })
  .refine((values) => values.vehicleMode !== "new" || Boolean(values.newVehicleVin), {
    path: ["newVehicleVin"],
    message: "VIN is required",
  })
  .refine((values) => values.vehicleMode !== "new" || Boolean(values.newVehiclePlateNumber), {
    path: ["newVehiclePlateNumber"],
    message: "Plate number is required",
  })
  .refine((values) => values.vehicleMode !== "new" || Boolean(values.newVehicleMake), {
    path: ["newVehicleMake"],
    message: "Make is required",
  })
  .refine((values) => values.vehicleMode !== "new" || Boolean(values.newVehicleModel), {
    path: ["newVehicleModel"],
    message: "Model is required",
  });

export type CreateOrderFormInput = z.input<typeof createOrderFormSchema>;
export type CreateOrderFormValues = z.output<typeof createOrderFormSchema>;

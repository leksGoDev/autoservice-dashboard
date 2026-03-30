import { z } from "zod";

export const createVehicleFormSchema = z.object({
  customerId: z.string().trim().min(1, "Customer is required"),
  vin: z.string().trim().min(1, "VIN is required"),
  plateNumber: z.string().trim().min(1, "Plate number is required"),
  make: z.string().trim().min(1, "Make is required"),
  model: z.string().trim().min(1, "Model is required"),
  year: z.coerce.number().int().min(1980).max(2100),
});

export type CreateVehicleFormInput = z.input<typeof createVehicleFormSchema>;
export type CreateVehicleFormValues = z.output<typeof createVehicleFormSchema>;

export function getCreateVehicleFormDefaultValues(): CreateVehicleFormInput {
  return {
    customerId: "",
    vin: "",
    plateNumber: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
  };
}

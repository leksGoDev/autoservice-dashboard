import { z } from "zod";

export const customerFormSchema = z.object({
  fullName: z.string().trim().min(1, "Customer full name is required"),
  phone: z.string().trim().min(1, "Customer phone is required"),
  email: z.string().trim().email("Valid customer email is required"),
  loyaltyTier: z.enum(["standard", "silver", "gold"]),
});

export type CustomerFormInput = z.input<typeof customerFormSchema>;
export type CustomerFormValues = z.output<typeof customerFormSchema>;

export function getCustomerFormDefaultValues(values?: Partial<CustomerFormInput>): CustomerFormInput {
  return {
    fullName: values?.fullName ?? "",
    phone: values?.phone ?? "",
    email: values?.email ?? "",
    loyaltyTier: values?.loyaltyTier ?? "standard",
  };
}

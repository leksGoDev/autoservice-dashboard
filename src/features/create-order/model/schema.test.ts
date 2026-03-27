import { createOrderFormSchema } from "./schema";

function buildValidPayload() {
  return {
    customerMode: "existing",
    existingCustomerId: "cust_001",
    newCustomerFullName: "",
    newCustomerPhone: "",
    newCustomerEmail: "",
    newCustomerLoyaltyTier: "standard",
    vehicleMode: "existing",
    existingVehicleId: "veh_001",
    newVehicleVin: "",
    newVehiclePlateNumber: "",
    newVehicleMake: "",
    newVehicleModel: "",
    newVehicleYear: 2024,
    scheduledFor: "2026-03-25T10:30",
    complaint: "Engine makes noise after startup",
    notes: "Customer requested fast diagnostics",
    assignedMechanic: "Ivan Petrov",
    priority: "medium",
    status: "scheduled",
    initialJobs: [
      {
        name: "Initial inspection",
        category: "Diagnostics",
        estimatedHours: 1,
        laborPrice: 120,
        assignedMechanic: "",
      },
    ],
  } as const;
}

describe("createOrderFormSchema", () => {
  it("accepts valid existing customer and vehicle payload", () => {
    const result = createOrderFormSchema.safeParse(buildValidPayload());

    expect(result.success).toBe(true);
  });

  it("requires existing customer and vehicle when selection mode is existing", () => {
    const result = createOrderFormSchema.safeParse({
      ...buildValidPayload(),
      existingCustomerId: "",
      existingVehicleId: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues.map((issue) => issue.path.join("."));
      expect(issues).toContain("existingCustomerId");
      expect(issues).toContain("existingVehicleId");
    }
  });

  it("requires inline customer and vehicle fields in new mode", () => {
    const result = createOrderFormSchema.safeParse({
      ...buildValidPayload(),
      customerMode: "new",
      vehicleMode: "new",
      newCustomerFullName: "",
      newCustomerPhone: "",
      newCustomerEmail: "invalid",
      newVehicleVin: "",
      newVehiclePlateNumber: "",
      newVehicleMake: "",
      newVehicleModel: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues.map((issue) => issue.path.join("."));
      expect(issues).toContain("newCustomerFullName");
      expect(issues).toContain("newCustomerPhone");
      expect(issues).toContain("newCustomerEmail");
      expect(issues).toContain("newVehicleVin");
      expect(issues).toContain("newVehiclePlateNumber");
      expect(issues).toContain("newVehicleMake");
      expect(issues).toContain("newVehicleModel");
    }
  });

  it("requires at least one initial service job", () => {
    const result = createOrderFormSchema.safeParse({
      ...buildValidPayload(),
      initialJobs: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join(".") === "initialJobs")).toBe(true);
    }
  });
});

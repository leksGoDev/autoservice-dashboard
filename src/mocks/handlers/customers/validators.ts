type CreateCustomerBody = Partial<{
  fullName: string;
  phone: string;
  email: string;
  loyaltyTier: "standard" | "silver" | "gold";
}>;

type ParsedCreateCustomerPayload = {
  fullName: string;
  phone: string;
  email: string;
  loyaltyTier: "standard" | "silver" | "gold";
};

export function parseCreateCustomerPayload(body: CreateCustomerBody | null): ParsedCreateCustomerPayload | null {
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const loyaltyTier = body?.loyaltyTier ?? "standard";

  if (!fullName || !phone || !email) {
    return null;
  }

  if (!["standard", "silver", "gold"].includes(loyaltyTier)) {
    return null;
  }

  return {
    fullName,
    phone,
    email,
    loyaltyTier,
  };
}

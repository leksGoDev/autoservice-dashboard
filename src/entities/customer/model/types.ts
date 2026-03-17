export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  loyaltyTier: "standard" | "silver" | "gold";
}

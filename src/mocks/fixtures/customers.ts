import type { Customer } from "@/entities/customer/model/types";

export const customersFixture: Customer[] = [
  {
    id: "cust_001",
    fullName: "Alex Turner",
    phone: "+1-555-0100",
    email: "alex.turner@example.com",
    loyaltyTier: "gold",
  },
  {
    id: "cust_002",
    fullName: "Morgan Lee",
    phone: "+1-555-0101",
    email: "morgan.lee@example.com",
    loyaltyTier: "silver",
  },
  {
    id: "cust_003",
    fullName: "Jamie Carter",
    phone: "+1-555-0102",
    email: "jamie.carter@example.com",
    loyaltyTier: "standard",
  },
  {
    id: "cust_004",
    fullName: "Taylor Brooks",
    phone: "+1-555-0103",
    email: "taylor.brooks@example.com",
    loyaltyTier: "silver",
  },
  {
    id: "cust_005",
    fullName: "Drew Wilson",
    phone: "+1-555-0104",
    email: "drew.wilson@example.com",
    loyaltyTier: "gold",
  },
];

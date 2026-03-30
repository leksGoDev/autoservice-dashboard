import type { Customer } from "@/entities/customer/model/types";

export const customersFixture: Customer[] = [
  {
    id: "cust_001",
    fullName: "Aleksey Volkov",
    phone: "+7 (901) 555-01-00",
    email: "aleksey.volkov@example.ru",
    loyaltyTier: "gold",
  },
  {
    id: "cust_002",
    fullName: "Marina Kim",
    phone: "+7 (902) 555-01-01",
    email: "marina.kim@example.kz",
    loyaltyTier: "silver",
  },
  {
    id: "cust_003",
    fullName: "Ilya Karpenko",
    phone: "+380 (67) 555-01-02",
    email: "ilya.karpenko@example.ua",
    loyaltyTier: "standard",
  },
  {
    id: "cust_004",
    fullName: "Darya Abdullaeva",
    phone: "+998 (90) 555-01-03",
    email: "darya.abdullaeva@example.uz",
    loyaltyTier: "silver",
  },
  {
    id: "cust_005",
    fullName: "Ruslan Sokolov",
    phone: "+375 (29) 555-01-04",
    email: "ruslan.sokolov@example.by",
    loyaltyTier: "gold",
  },
];

import type { OrderListItem } from "@/entities/order/model/types";

export type OrderFixtureItem = Omit<OrderListItem, "priority" | "assignedMechanic" | "jobsCount" | "flagged">;
export type OrderJobCatalogItem = {
  name: string;
  category: string;
  estimatedHours: number;
  laborRate: number;
};

export type OrderPartCatalogItem = {
  name: string;
  unitPrice: number;
};

export const orderMechanicsFixture = [
  "Artem Bondar",
  "Nikita Isaev",
  "Damir Karimov",
  "Ilya Melnik",
  "Timur Sadykov",
  "Ruslan Aliev",
] as const;

export const orderJobCatalogFixture: OrderJobCatalogItem[] = [
  { name: "Initial inspection", category: "Diagnostics", estimatedHours: 1.2, laborRate: 95 },
  { name: "Brake system service", category: "Repair", estimatedHours: 2.4, laborRate: 120 },
  { name: "Suspension adjustment", category: "Repair", estimatedHours: 2.1, laborRate: 110 },
  { name: "Engine tune-up", category: "Maintenance", estimatedHours: 1.8, laborRate: 105 },
  { name: "Electrical diagnostics", category: "Electrical", estimatedHours: 1.5, laborRate: 115 },
];

export const orderPartCatalogFixture: OrderPartCatalogItem[] = [
  { name: "Brake pads set", unitPrice: 140 },
  { name: "Oil filter", unitPrice: 18 },
  { name: "Spark plug", unitPrice: 24 },
  { name: "Cabin air filter", unitPrice: 22 },
  { name: "Wheel speed sensor", unitPrice: 86 },
  { name: "Transmission fluid", unitPrice: 34 },
];

export const ordersFixture: OrderFixtureItem[] = [
  {
    id: "ord_001",
    number: "ORD-1001",
    status: "in_progress",
    customerId: "cust_001",
    customerName: "Aleksey Volkov",
    vehicleId: "veh_001",
    vehicleLabel: "2019 Honda Accord",
    totalAmount: 680,
    createdAt: "2026-03-11T08:30:00.000Z",
    updatedAt: "2026-03-18T09:10:00.000Z",
  },
  {
    id: "ord_002",
    number: "ORD-1002",
    status: "scheduled",
    customerId: "cust_002",
    customerName: "Marina Kim",
    vehicleId: "veh_002",
    vehicleLabel: "2018 Nissan Altima",
    totalAmount: 240,
    createdAt: "2026-03-12T10:20:00.000Z",
    updatedAt: "2026-03-18T08:40:00.000Z",
  },
  {
    id: "ord_003",
    number: "ORD-1003",
    status: "waiting_parts",
    customerId: "cust_003",
    customerName: "Ilya Karpenko",
    vehicleId: "veh_003",
    vehicleLabel: "2020 Ford F-150",
    totalAmount: 1250,
    createdAt: "2026-03-09T15:15:00.000Z",
    updatedAt: "2026-03-18T07:55:00.000Z",
  },
  {
    id: "ord_004",
    number: "ORD-1004",
    status: "completed",
    customerId: "cust_004",
    customerName: "Darya Abdullaeva",
    vehicleId: "veh_004",
    vehicleLabel: "2021 BMW 330i",
    totalAmount: 960,
    createdAt: "2026-03-07T09:05:00.000Z",
    updatedAt: "2026-03-17T17:40:00.000Z",
  },
  {
    id: "ord_005",
    number: "ORD-1005",
    status: "completed",
    customerId: "cust_005",
    customerName: "Ruslan Sokolov",
    vehicleId: "veh_005",
    vehicleLabel: "2022 Tesla Model S",
    totalAmount: 340,
    createdAt: "2026-03-10T11:50:00.000Z",
    updatedAt: "2026-03-17T19:20:00.000Z",
  },
  {
    id: "ord_006",
    number: "ORD-1006",
    status: "cancelled",
    customerId: "cust_003",
    customerName: "Ilya Karpenko",
    vehicleId: "veh_003",
    vehicleLabel: "2020 Ford F-150",
    totalAmount: 180,
    createdAt: "2026-03-08T12:10:00.000Z",
    updatedAt: "2026-03-16T16:12:00.000Z",
  },
  {
    id: "ord_007",
    number: "ORD-1007",
    status: "in_progress",
    customerId: "cust_004",
    customerName: "Darya Abdullaeva",
    vehicleId: "veh_004",
    vehicleLabel: "2021 BMW 330i",
    totalAmount: 760,
    createdAt: "2026-03-14T13:20:00.000Z",
    updatedAt: "2026-03-18T09:25:00.000Z",
  },
  {
    id: "ord_008",
    number: "ORD-1008",
    status: "scheduled",
    customerId: "cust_001",
    customerName: "Aleksey Volkov",
    vehicleId: "veh_001",
    vehicleLabel: "2019 Honda Accord",
    totalAmount: 520,
    createdAt: "2026-03-15T09:40:00.000Z",
    updatedAt: "2026-03-18T08:12:00.000Z",
  },
  {
    id: "ord_009",
    number: "ORD-1009",
    status: "waiting_parts",
    customerId: "cust_005",
    customerName: "Ruslan Sokolov",
    vehicleId: "veh_005",
    vehicleLabel: "2022 Tesla Model S",
    totalAmount: 1490,
    createdAt: "2026-03-13T10:05:00.000Z",
    updatedAt: "2026-03-18T06:50:00.000Z",
  },
  {
    id: "ord_010",
    number: "ORD-1010",
    status: "completed",
    customerId: "cust_002",
    customerName: "Marina Kim",
    vehicleId: "veh_002",
    vehicleLabel: "2018 Nissan Altima",
    totalAmount: 430,
    createdAt: "2026-03-06T16:45:00.000Z",
    updatedAt: "2026-03-17T18:30:00.000Z",
  },
  {
    id: "ord_011",
    number: "ORD-1011",
    status: "in_progress",
    customerId: "cust_003",
    customerName: "Ilya Karpenko",
    vehicleId: "veh_003",
    vehicleLabel: "2020 Ford F-150",
    totalAmount: 870,
    createdAt: "2026-03-16T08:55:00.000Z",
    updatedAt: "2026-03-18T09:35:00.000Z",
  },
  {
    id: "ord_012",
    number: "ORD-1012",
    status: "scheduled",
    customerId: "cust_004",
    customerName: "Darya Abdullaeva",
    vehicleId: "veh_004",
    vehicleLabel: "2021 BMW 330i",
    totalAmount: 390,
    createdAt: "2026-03-17T07:25:00.000Z",
    updatedAt: "2026-03-18T07:22:00.000Z",
  },
];

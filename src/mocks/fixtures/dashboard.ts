import type {
  DashboardMetrics,
  DashboardOrdersTrendPoint,
  DashboardRange,
  DashboardRevenuePoint,
  MechanicWorkloadItem,
  RecentActivityItem,
  RecentOrderItem,
} from "@/entities/dashboard/model/types";

export const dashboardMetricsFixture: DashboardMetrics = {
  active: 5,
  overdue: 2,
  scheduled: 3,
  revenueToday: 3010,
  revenueThisMonth: 21940,
};

const revenueByRange: Record<DashboardRange, DashboardRevenuePoint[]> = {
  "7d": [
    { date: "2026-03-12", revenue: 1800 },
    { date: "2026-03-13", revenue: 2460 },
    { date: "2026-03-14", revenue: 2130 },
    { date: "2026-03-15", revenue: 2750 },
    { date: "2026-03-16", revenue: 1980 },
    { date: "2026-03-17", revenue: 3240 },
    { date: "2026-03-18", revenue: 3010 },
  ],
  "30d": [
    { date: "2026-02-20", revenue: 12200 },
    { date: "2026-02-27", revenue: 13900 },
    { date: "2026-03-06", revenue: 15450 },
    { date: "2026-03-13", revenue: 17600 },
    { date: "2026-03-18", revenue: 21940 },
  ],
  "90d": [
    { date: "2025-12-20", revenue: 47200 },
    { date: "2026-01-20", revenue: 50600 },
    { date: "2026-02-20", revenue: 54100 },
    { date: "2026-03-18", revenue: 58940 },
  ],
};

const ordersTrendByRange: Record<DashboardRange, DashboardOrdersTrendPoint[]> = {
  "7d": [
    { date: "2026-03-12", total: 8, completed: 5 },
    { date: "2026-03-13", total: 9, completed: 6 },
    { date: "2026-03-14", total: 10, completed: 7 },
    { date: "2026-03-15", total: 8, completed: 5 },
    { date: "2026-03-16", total: 11, completed: 8 },
    { date: "2026-03-17", total: 12, completed: 9 },
    { date: "2026-03-18", total: 10, completed: 7 },
  ],
  "30d": [
    { date: "2026-02-20", total: 42, completed: 31 },
    { date: "2026-02-27", total: 47, completed: 35 },
    { date: "2026-03-06", total: 50, completed: 38 },
    { date: "2026-03-13", total: 53, completed: 40 },
    { date: "2026-03-18", total: 58, completed: 44 },
  ],
  "90d": [
    { date: "2025-12-20", total: 126, completed: 96 },
    { date: "2026-01-20", total: 138, completed: 107 },
    { date: "2026-02-20", total: 143, completed: 111 },
    { date: "2026-03-18", total: 155, completed: 121 },
  ],
};

export const mechanicWorkloadFixture: MechanicWorkloadItem[] = [
  {
    mechanicId: "mech_001",
    mechanicName: "Chris Nolan",
    assignedOrders: 4,
    utilization: 82,
  },
  {
    mechanicId: "mech_002",
    mechanicName: "Sam Rivera",
    assignedOrders: 3,
    utilization: 66,
  },
  {
    mechanicId: "mech_003",
    mechanicName: "Jordan Kim",
    assignedOrders: 5,
    utilization: 90,
  },
  {
    mechanicId: "mech_004",
    mechanicName: "Riley Adams",
    assignedOrders: 2,
    utilization: 44,
  },
];

export const recentActivityFixture: RecentActivityItem[] = [
  {
    id: "act_001",
    timestamp: "2026-03-18T09:36:00.000Z",
    message: "Order ORD-1011 moved to in progress",
    orderId: "ord_011",
  },
  {
    id: "act_002",
    timestamp: "2026-03-18T09:27:00.000Z",
    message: "Mechanic assigned to ORD-1007",
    orderId: "ord_007",
  },
  {
    id: "act_003",
    timestamp: "2026-03-18T09:11:00.000Z",
    message: "Parts received for ORD-1001",
    orderId: "ord_001",
  },
  {
    id: "act_004",
    timestamp: "2026-03-18T08:42:00.000Z",
    message: "Order ORD-1002 scheduled for service",
    orderId: "ord_002",
  },
];

export const recentOrdersFixture: RecentOrderItem[] = [
  {
    id: "ord_011",
    number: "ORD-1011",
    customerName: "Jamie Carter",
    vehicleLabel: "2020 Ford F-150",
    status: "in_progress",
    priority: "high",
    assignedMechanic: "Jordan Kim",
    jobsCount: 3,
    totalCost: 870,
    createdDate: "2026-03-16T08:55:00.000Z",
  },
  {
    id: "ord_007",
    number: "ORD-1007",
    customerName: "Taylor Brooks",
    vehicleLabel: "2021 BMW 330i",
    status: "in_progress",
    priority: "medium",
    assignedMechanic: "Chris Nolan",
    jobsCount: 2,
    totalCost: 760,
    createdDate: "2026-03-14T13:20:00.000Z",
  },
  {
    id: "ord_001",
    number: "ORD-1001",
    customerName: "Alex Turner",
    vehicleLabel: "2019 Honda Accord",
    status: "in_progress",
    priority: "medium",
    assignedMechanic: "Sam Rivera",
    jobsCount: 2,
    totalCost: 680,
    createdDate: "2026-03-11T08:30:00.000Z",
  },
  {
    id: "ord_002",
    number: "ORD-1002",
    customerName: "Morgan Lee",
    vehicleLabel: "2018 Nissan Altima",
    status: "scheduled",
    priority: "low",
    assignedMechanic: "Riley Adams",
    jobsCount: 1,
    totalCost: 240,
    createdDate: "2026-03-12T10:20:00.000Z",
  },
];

export function getRevenueFixtureByRange(range: DashboardRange = "30d") {
  return revenueByRange[range];
}

export function getOrdersTrendFixtureByRange(range: DashboardRange = "30d") {
  return ordersTrendByRange[range];
}

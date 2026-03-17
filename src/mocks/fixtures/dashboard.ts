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
  revenueTotal: 21940,
  activeOrders: 5,
  completedToday: 3,
  averageCycleHours: 18.4,
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
    utilization: 0.82,
  },
  {
    mechanicId: "mech_002",
    mechanicName: "Sam Rivera",
    assignedOrders: 3,
    utilization: 0.66,
  },
  {
    mechanicId: "mech_003",
    mechanicName: "Jordan Kim",
    assignedOrders: 5,
    utilization: 0.9,
  },
  {
    mechanicId: "mech_004",
    mechanicName: "Riley Adams",
    assignedOrders: 2,
    utilization: 0.44,
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
    status: "in_progress",
    updatedAt: "2026-03-18T09:35:00.000Z",
  },
  {
    id: "ord_007",
    number: "ORD-1007",
    customerName: "Taylor Brooks",
    status: "in_progress",
    updatedAt: "2026-03-18T09:25:00.000Z",
  },
  {
    id: "ord_001",
    number: "ORD-1001",
    customerName: "Alex Turner",
    status: "in_progress",
    updatedAt: "2026-03-18T09:10:00.000Z",
  },
  {
    id: "ord_002",
    number: "ORD-1002",
    customerName: "Morgan Lee",
    status: "scheduled",
    updatedAt: "2026-03-18T08:40:00.000Z",
  },
];

export function getRevenueFixtureByRange(range: DashboardRange = "30d") {
  return revenueByRange[range];
}

export function getOrdersTrendFixtureByRange(range: DashboardRange = "30d") {
  return ordersTrendByRange[range];
}

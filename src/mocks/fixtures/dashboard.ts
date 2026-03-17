import type {
  DashboardMetrics,
  DashboardOrdersTrendPoint,
  DashboardRange,
  DashboardRevenuePoint,
  MechanicWorkloadItem,
  RecentActivityItem,
  RecentOrderItem,
} from "@/entities/dashboard/model/types";
import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";

const metricsByRange: Record<DashboardRange, DashboardMetrics> = {
  "7d": {
    active: 5,
    overdue: 2,
    scheduled: 3,
    revenueToday: 3010,
    revenueThisMonth: 21940,
  },
  "30d": {
    active: 7,
    overdue: 3,
    scheduled: 5,
    revenueToday: 3010,
    revenueThisMonth: 21940,
  },
  "90d": {
    active: 9,
    overdue: 4,
    scheduled: 6,
    revenueToday: 3010,
    revenueThisMonth: 58940,
  },
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

const mechanicWorkloadByRange: Record<DashboardRange, MechanicWorkloadItem[]> = {
  "7d": [
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
  ],
  "30d": [
    {
      mechanicId: "mech_001",
      mechanicName: "Chris Nolan",
      assignedOrders: 6,
      utilization: 84,
    },
    {
      mechanicId: "mech_002",
      mechanicName: "Sam Rivera",
      assignedOrders: 5,
      utilization: 72,
    },
    {
      mechanicId: "mech_003",
      mechanicName: "Jordan Kim",
      assignedOrders: 7,
      utilization: 92,
    },
    {
      mechanicId: "mech_004",
      mechanicName: "Riley Adams",
      assignedOrders: 4,
      utilization: 58,
    },
  ],
  "90d": [
    {
      mechanicId: "mech_001",
      mechanicName: "Chris Nolan",
      assignedOrders: 8,
      utilization: 86,
    },
    {
      mechanicId: "mech_002",
      mechanicName: "Sam Rivera",
      assignedOrders: 7,
      utilization: 78,
    },
    {
      mechanicId: "mech_003",
      mechanicName: "Jordan Kim",
      assignedOrders: 9,
      utilization: 93,
    },
    {
      mechanicId: "mech_004",
      mechanicName: "Riley Adams",
      assignedOrders: 6,
      utilization: 64,
    },
  ],
};

const recentActivity7d: RecentActivityItem[] = [
  {
    id: "act_001",
    type: "status_changed",
    createdAt: "2026-03-18T09:36:00.000Z",
    message: "Order ORD-1011 moved to in progress",
    orderId: "ord_011",
  },
  {
    id: "act_002",
    type: "mechanic_assigned",
    createdAt: "2026-03-18T09:27:00.000Z",
    message: "Mechanic assigned to ORD-1007",
    orderId: "ord_007",
  },
  {
    id: "act_003",
    type: "parts_updated",
    createdAt: "2026-03-18T09:11:00.000Z",
    message: "Parts received for ORD-1001",
    orderId: "ord_001",
  },
  {
    id: "act_004",
    type: "order_scheduled",
    createdAt: "2026-03-18T08:42:00.000Z",
    message: "Order ORD-1002 scheduled for service",
    orderId: "ord_002",
  },
];

const recentActivity30d: RecentActivityItem[] = [
  {
    id: "act_005",
    type: "order_created",
    createdAt: "2026-03-17T15:20:00.000Z",
    message: "Order ORD-1012 created",
    orderId: "ord_012",
  },
  {
    id: "act_006",
    type: "status_changed",
    createdAt: "2026-03-17T14:05:00.000Z",
    message: "Order ORD-1010 marked as completed",
    orderId: "ord_010",
  },
  ...recentActivity7d,
];

const recentActivity90d: RecentActivityItem[] = [
  {
    id: "act_007",
    type: "order_created",
    createdAt: "2026-02-20T10:10:00.000Z",
    message: "Order ORD-0964 created",
    orderId: "ord_964",
  },
  ...recentActivity30d,
];

const recentActivityByRange: Record<DashboardRange, RecentActivityItem[]> = {
  "7d": recentActivity7d,
  "30d": recentActivity30d,
  "90d": recentActivity90d,
};

const recentOrders7d: RecentOrderItem[] = [
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
      createdAt: "2026-03-16T08:55:00.000Z",
      updatedAt: "2026-03-18T09:35:00.000Z",
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
      createdAt: "2026-03-14T13:20:00.000Z",
      updatedAt: "2026-03-18T09:25:00.000Z",
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
      createdAt: "2026-03-11T08:30:00.000Z",
      updatedAt: "2026-03-18T09:10:00.000Z",
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
      createdAt: "2026-03-12T10:20:00.000Z",
      updatedAt: "2026-03-18T08:40:00.000Z",
    },
  ];

const recentOrders30d: RecentOrderItem[] = [
  {
    id: "ord_012",
    number: "ORD-1012",
    customerName: "Taylor Brooks",
    vehicleLabel: "2021 BMW 330i",
    status: "scheduled",
    priority: "low",
    assignedMechanic: "Chris Nolan",
    jobsCount: 1,
    totalCost: 390,
    createdAt: "2026-03-17T07:25:00.000Z",
    updatedAt: "2026-03-18T07:22:00.000Z",
  },
  ...recentOrders7d,
];

const recentOrders90d: RecentOrderItem[] = [
  {
    id: "ord_964",
    number: "ORD-0964",
    customerName: "Morgan Lee",
    vehicleLabel: "2018 Nissan Altima",
    status: "completed",
    priority: "medium",
    assignedMechanic: "Sam Rivera",
    jobsCount: 2,
    totalCost: 530,
    createdAt: "2026-02-20T08:40:00.000Z",
    updatedAt: "2026-02-21T15:05:00.000Z",
  },
  ...recentOrders30d,
];

const recentOrdersByRange: Record<DashboardRange, RecentOrderItem[]> = {
  "7d": recentOrders7d,
  "30d": recentOrders30d,
  "90d": recentOrders90d,
};

export function getMetricsFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return metricsByRange[range];
}

export function getRevenueFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return revenueByRange[range];
}

export function getOrdersTrendFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return ordersTrendByRange[range];
}

export function getMechanicWorkloadFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return mechanicWorkloadByRange[range];
}

export function getRecentActivityFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return recentActivityByRange[range];
}

export function getRecentOrdersFixtureByRange(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return recentOrdersByRange[range];
}

import type { OrderStatus } from "@/entities/order/model/types";

export type DashboardRange = "7d" | "30d" | "90d";

export interface DashboardMetrics {
  revenueTotal: number;
  activeOrders: number;
  completedToday: number;
  averageCycleHours: number;
}

export interface DashboardRevenuePoint {
  date: string;
  revenue: number;
}

export interface DashboardOrdersTrendPoint {
  date: string;
  total: number;
  completed: number;
}

export interface MechanicWorkloadItem {
  mechanicId: string;
  mechanicName: string;
  assignedOrders: number;
  utilization: number;
}

export interface RecentActivityItem {
  id: string;
  timestamp: string;
  message: string;
  orderId: string;
}

export interface RecentOrderItem {
  id: string;
  number: string;
  customerName: string;
  status: OrderStatus;
  updatedAt: string;
}

export interface DashboardOverview {
  metrics: DashboardMetrics;
  revenue: DashboardRevenuePoint[];
  ordersTrend: DashboardOrdersTrendPoint[];
  mechanicWorkload: MechanicWorkloadItem[];
  recentActivity: RecentActivityItem[];
  recentOrders: RecentOrderItem[];
}

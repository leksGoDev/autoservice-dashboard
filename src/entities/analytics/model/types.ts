import type { MechanicsRange } from "@/entities/mechanic/model/types";

export type AnalyticsRange = MechanicsRange;

export interface AnalyticsMetrics {
  totalRevenue: number;
  averageOrderValue: number;
  completionRate: number;
  activeMechanics: number;
}

export interface AnalyticsRevenuePoint {
  date: string;
  revenue: number;
}

export interface AnalyticsOrdersPerDayPoint {
  date: string;
  total: number;
  completed: number;
}

export interface JobsByCategoryPoint {
  category: string;
  scheduled: number;
  inProgress: number;
  completed: number;
}

export interface AnalyticsMechanicWorkloadItem {
  mechanicId: string;
  mechanicName: string;
  assignedOrders: number;
  utilization: number;
}

export interface AnalyticsOverview {
  metrics: AnalyticsMetrics;
  revenue: AnalyticsRevenuePoint[];
  ordersPerDay: AnalyticsOrdersPerDayPoint[];
  jobsByCategory: JobsByCategoryPoint[];
  mechanicWorkload: AnalyticsMechanicWorkloadItem[];
}

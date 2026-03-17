import type { ActivityItem } from "../../../widgets/dashboard-recent-activity/DashboardRecentActivity";
import type { DashboardKpi } from "../../../widgets/dashboard-kpi-cards/DashboardKpiCards";
import type { MechanicWorkloadItem } from "../../../widgets/dashboard-mechanic-workload/DashboardMechanicWorkload";
import type { OrdersTrendPoint } from "../../../widgets/dashboard-orders-trend/DashboardOrdersTrend";
import type { RecentOrder } from "../../../widgets/dashboard-recent-orders/DashboardRecentOrders";
import type { RevenuePoint } from "../../../widgets/dashboard-revenue-chart/DashboardRevenueChart";

export const dashboardKpiItems: DashboardKpi[] = [
  { id: "active", label: "Active Orders", value: "42", trend: "+6 vs yesterday", trendTone: "up" },
  { id: "overdue", label: "Overdue Orders", value: "7", trend: "-2 vs yesterday", trendTone: "down" },
  { id: "scheduled", label: "Scheduled Orders", value: "18", trend: "+3 next 24h", trendTone: "up" },
  { id: "today", label: "Revenue Today", value: "$12,480", trend: "+8.4% day-over-day", trendTone: "up" },
  {
    id: "month",
    label: "Revenue This Month",
    value: "$314,200",
    trend: "+4.9% month-over-month",
    trendTone: "up",
  },
];

export const dashboardRevenueData: RevenuePoint[] = [
  { label: "Mon", revenue: 9400 },
  { label: "Tue", revenue: 10200 },
  { label: "Wed", revenue: 9800 },
  { label: "Thu", revenue: 11400 },
  { label: "Fri", revenue: 12480 },
  { label: "Sat", revenue: 11820 },
  { label: "Sun", revenue: 10600 },
];

export const dashboardOrdersTrendData: OrdersTrendPoint[] = [
  { label: "Mon", created: 17, completed: 11 },
  { label: "Tue", created: 19, completed: 13 },
  { label: "Wed", created: 16, completed: 14 },
  { label: "Thu", created: 22, completed: 15 },
  { label: "Fri", created: 24, completed: 18 },
  { label: "Sat", created: 20, completed: 19 },
  { label: "Sun", created: 14, completed: 16 },
];

export const dashboardRecentOrders: RecentOrder[] = [
  {
    id: "WO-1042",
    customer: "Ethan Walker",
    vehicle: "BMW X3",
    status: "In Progress",
    priority: "High",
    mechanic: "A. Novak",
    totalCost: 860,
    createdAt: "08:12",
  },
  {
    id: "WO-1041",
    customer: "Mia Carter",
    vehicle: "Audi A4",
    status: "Waiting Parts",
    priority: "Urgent",
    mechanic: "I. Smirnov",
    totalCost: 1240,
    createdAt: "07:46",
  },
  {
    id: "WO-1040",
    customer: "Lucas Hall",
    vehicle: "Skoda Octavia",
    status: "Scheduled",
    priority: "Medium",
    mechanic: "D. Kim",
    totalCost: 520,
    createdAt: "07:21",
  },
  {
    id: "WO-1039",
    customer: "Ava Adams",
    vehicle: "Toyota Camry",
    status: "Completed",
    priority: "Low",
    mechanic: "P. Ivanov",
    totalCost: 390,
    createdAt: "06:58",
  },
  {
    id: "WO-1038",
    customer: "Noah Green",
    vehicle: "Mercedes C200",
    status: "Cancelled",
    priority: "Low",
    mechanic: "S. Petrov",
    totalCost: 0,
    createdAt: "06:22",
  },
];

export const dashboardRecentActivity: ActivityItem[] = [
  {
    id: "act-1",
    title: "WO-1042 moved to In Progress",
    details: "Assigned mechanic A. Novak started brake diagnostics.",
    time: "5 min ago",
    tone: "neutral",
  },
  {
    id: "act-2",
    title: "Part ETA delayed",
    details: "Front shock absorber for WO-1041 now expected at 15:30.",
    time: "14 min ago",
    tone: "warning",
  },
  {
    id: "act-3",
    title: "WO-1039 completed",
    details: "Final inspection passed and customer pickup confirmed.",
    time: "29 min ago",
    tone: "success",
  },
  {
    id: "act-4",
    title: "Urgent order created",
    details: "WO-1043 created for coolant leak and flagged as urgent.",
    time: "42 min ago",
    tone: "danger",
  },
];

export const dashboardMechanicWorkload: MechanicWorkloadItem[] = [
  { id: "m-1", name: "A. Novak", activeOrders: 6, utilization: 92 },
  { id: "m-2", name: "I. Smirnov", activeOrders: 5, utilization: 84 },
  { id: "m-3", name: "D. Kim", activeOrders: 4, utilization: 72 },
  { id: "m-4", name: "P. Ivanov", activeOrders: 3, utilization: 64 },
];

export type MechanicStatus = "available" | "busy" | "off_shift";

export type MechanicsRange = "7d" | "30d" | "90d";

export interface MechanicRegistryItem {
  id: string;
  name: string;
  specialization: string;
  activeJobs: number;
  status: MechanicStatus;
  experienceYears: number;
}

export interface MechanicsRegistryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface MechanicWorkloadItem {
  mechanicId: string;
  mechanicName: string;
  assignedOrders: number;
  utilization: number;
}

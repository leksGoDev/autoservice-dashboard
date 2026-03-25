import type { OrderServiceJob } from "@/entities/order/model/types";
import { ServiceJobsWorkspace } from "@/features/order-operations/ui/ServiceJobsWorkspace";

type OrderDetailsJobsTableProps = {
  orderId: string;
  jobs: OrderServiceJob[];
  mechanics: string[];
};

export const OrderDetailsJobsTable = ({ orderId, jobs, mechanics }: OrderDetailsJobsTableProps) => {
  return <ServiceJobsWorkspace orderId={orderId} jobs={jobs} mechanics={mechanics} />;
};

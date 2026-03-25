import type { OrderPartItem } from "@/entities/order/model/types";
import type { OrderServiceJob } from "@/entities/order/model/types";
import { ServicePartsWorkspace } from "@/features/order-operations/ui/ServicePartsWorkspace";

type OrderDetailsPartsTableProps = {
  orderId: string;
  jobs: OrderServiceJob[];
  parts: OrderPartItem[];
};

export const OrderDetailsPartsTable = ({ orderId, jobs, parts }: OrderDetailsPartsTableProps) => {
  return <ServicePartsWorkspace orderId={orderId} jobs={jobs} parts={parts} />;
};

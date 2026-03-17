import type { FC } from "react";

import type { MechanicWorkloadItem } from "@/entities/dashboard/model/types";
import { getWorkloadTone } from "@/entities/dashboard/model/presentation";

import { WidgetCard } from "@/shared/ui/WidgetCard";

interface DashboardMechanicWorkloadProps {
  items: MechanicWorkloadItem[];
}

export const DashboardMechanicWorkload: FC<DashboardMechanicWorkloadProps> = ({ items }) => {
  return (
    <WidgetCard title="Mechanic Workload" description="Current active workload by mechanic">
      <ul className="workload-list">
        {items.map((item) => (
          <li key={item.mechanicId} className="workload-list__item">
            <div className="workload-list__row">
              <p className="workload-list__name">{item.mechanicName}</p>
              <span className={`workload-list__badge workload-list__badge--${getWorkloadTone(item.utilization)}`}>
                {item.assignedOrders} active
              </span>
            </div>
            <div className="workload-list__meta">
              <div className="workload-list__bar">
                <span className="workload-list__bar-fill" style={{ width: `${item.utilization}%` }} />
              </div>
              <span className="workload-list__value">{item.utilization}%</span>
            </div>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
};

import { getWorkloadTone } from "@/entities/dashboard/model/presentation";
import type { MechanicWorkloadItem } from "@/entities/dashboard/model/types";
import { workloadToneClassMap } from "../model/presentation";

type MechanicWorkloadRowProps = {
  item: MechanicWorkloadItem;
  compact: boolean;
  activeLabel: string;
};

export const MechanicWorkloadRow = ({ item, compact, activeLabel }: MechanicWorkloadRowProps) => {
  const workloadTone = getWorkloadTone(item.utilization);

  return (
    <li
      className={[
        "rounded-xl border border-[rgba(154,164,178,0.16)] bg-[rgba(15,17,21,0.2)]",
        compact ? "p-2.5" : "p-3",
      ].join(" ")}
    >
      <div className={["flex items-center justify-between gap-3", compact ? "mb-1.5" : "mb-2"].join(" ")}>
        <p className={["m-0 font-semibold", compact ? "text-[13px]" : "text-sm"].join(" ")}>{item.mechanicName}</p>
        <span
          className={[
            "rounded-full text-xs font-semibold",
            compact ? "px-1.5 py-0.5" : "px-2 py-0.5",
            workloadToneClassMap[workloadTone],
          ].join(" ")}
        >
          {item.assignedOrders} {activeLabel}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div
          className={[
            "flex-1 overflow-hidden rounded-full bg-[rgba(154,164,178,0.2)]",
            compact ? "h-1.5" : "h-2",
          ].join(" ")}
        >
          <span
            className="block h-full rounded-full bg-[linear-gradient(90deg,#6ba4ff,#3b82f6)]"
            style={{ width: `${item.utilization}%` }}
          />
        </div>
        <span className="min-w-[34px] text-right text-xs text-[var(--color-text-secondary)]">{item.utilization}%</span>
      </div>
    </li>
  );
};

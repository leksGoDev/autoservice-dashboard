import "./registry-primitives.css";

import type { FC, ReactNode } from "react";

interface DataStateProps {
  message: string;
  tone?: "default" | "error";
  action?: ReactNode;
}

export const DataState: FC<DataStateProps> = ({ message, tone = "default", action }) => {
  return (
    <section className={`data-state${tone === "error" ? " data-state--error" : ""}`}>
      <span>{message}</span>
      {action ? <div>{action}</div> : null}
    </section>
  );
};

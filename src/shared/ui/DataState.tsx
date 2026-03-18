import type { FC, ReactNode } from "react";
import styles from "./RegistryPrimitives.module.css";

interface DataStateProps {
  message: string;
  tone?: "default" | "error";
  action?: ReactNode;
}

export const DataState: FC<DataStateProps> = ({ message, tone = "default", action }) => {
  return (
    <section
      className={[
        "flex items-center justify-between gap-3 rounded-xl px-[18px] py-[18px] text-[var(--color-text-secondary)] max-[960px]:flex-col max-[960px]:items-stretch",
        styles.dataState,
        tone === "error" ? styles.dataStateError : "",
      ].join(" ").trim()}
    >
      <span>{message}</span>
      {action ? <div>{action}</div> : null}
    </section>
  );
};

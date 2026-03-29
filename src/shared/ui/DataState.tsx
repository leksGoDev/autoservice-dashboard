import type { ReactNode } from "react";
import styles from "./RegistryPrimitives.module.css";

type DataStateProps = {
  message: string;
  tone?: "default" | "error";
  action?: ReactNode;
};

export const DataState = ({ message, tone = "default", action }: DataStateProps) => {
  return (
    <section
      className={[
        "flex items-center justify-between gap-3 rounded-xl px-4 py-4 text-[var(--color-text-secondary)] max-[960px]:flex-col max-[960px]:items-stretch",
        styles.dataState,
        tone === "error" ? styles.dataStateError : "",
      ].join(" ").trim()}
    >
      <span>{message}</span>
      {action ? <div>{action}</div> : null}
    </section>
  );
};

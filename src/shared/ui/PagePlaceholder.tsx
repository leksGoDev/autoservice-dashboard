import { ReactNode } from "react";
import styles from "./PagePlaceholder.module.css";

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  children,
}: PagePlaceholderProps) {
  return (
    <section className={styles.root}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.grid}>{children}</div>
    </section>
  );
}

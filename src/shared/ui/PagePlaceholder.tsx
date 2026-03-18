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
    <section className="grid gap-5">
      <div className={`${styles.hero} p-7`}>
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
          {eyebrow}
        </span>
        <h1 className="my-2.5 text-[32px] leading-[1.1]">{title}</h1>
        <p className="max-w-[760px] text-[var(--color-text-secondary)]">{description}</p>
      </div>
      <div className="grid gap-4 max-[960px]:grid-cols-1 md:grid-cols-3">{children}</div>
    </section>
  );
}

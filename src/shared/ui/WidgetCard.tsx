import type { ReactNode } from "react";

type WidgetCardProps = {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export const WidgetCard = ({ title, description, className, children }: WidgetCardProps) => {
  const cardClassName = [
    "rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={cardClassName}>
      <header className="mb-3.5 grid gap-1.5">
        <h2 className="m-0 text-base">{title}</h2>
        {description ? <p className="m-0 text-[13px] text-[var(--color-text-secondary)]">{description}</p> : null}
      </header>
      {children}
    </section>
  );
};

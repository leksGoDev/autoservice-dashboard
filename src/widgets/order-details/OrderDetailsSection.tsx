import type { ReactNode } from "react";

type OrderDetailsSectionProps = {
  title: string;
  children: ReactNode;
};

export const OrderDetailsSection = ({ title, children }: OrderDetailsSectionProps) => {
  return (
    <article className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-5">
      <h2 className="m-0 text-base font-bold">{title}</h2>
      {children}
    </article>
  );
};

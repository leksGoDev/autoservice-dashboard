import { ReactNode } from "react";

type WidgetCardProps = {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function WidgetCard({ title, description, className, children }: WidgetCardProps) {
  const cardClassName = className ? `widget-card ${className}` : "widget-card";

  return (
    <section className={cardClassName}>
      <header className="widget-card__header">
        <h2 className="widget-card__title">{title}</h2>
        {description ? <p className="widget-card__description">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

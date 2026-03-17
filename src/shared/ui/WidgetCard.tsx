import type { FC, ReactNode } from "react";

interface WidgetCardProps {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

export const WidgetCard: FC<WidgetCardProps> = ({ title, description, className, children }) => {
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
};

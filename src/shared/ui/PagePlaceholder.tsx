import { ReactNode } from "react";

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
    <section className="page-placeholder">
      <div className="page-placeholder__hero">
        <span className="page-placeholder__eyebrow">{eyebrow}</span>
        <h1 className="page-placeholder__title">{title}</h1>
        <p className="page-placeholder__description">{description}</p>
      </div>
      <div className="page-placeholder__grid">{children}</div>
    </section>
  );
}

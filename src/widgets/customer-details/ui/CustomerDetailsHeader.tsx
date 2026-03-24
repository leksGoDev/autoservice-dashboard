import { Link } from "react-router-dom";

type CustomerDetailsHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  customerIdLabel: string;
  backLabel: string;
};

export const CustomerDetailsHeader = ({
  eyebrow,
  title,
  description,
  customerIdLabel,
  backLabel,
}: CustomerDetailsHeaderProps) => {
  return (
    <header className="grid gap-[10px] rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
      <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
        {eyebrow}
      </span>
      <h1 className="m-0 text-[28px] leading-[1.15]">{title}</h1>
      <p className="m-0 text-[var(--color-text-secondary)]">{description}</p>
      <p className="m-0 text-[var(--color-text-secondary)]">{customerIdLabel}</p>
      <Link
        to="/customers"
        className="inline-flex w-fit rounded-full border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.14)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--color-accent-light-blue)] transition-colors hover:bg-[rgba(107,164,255,0.2)]"
      >
        {backLabel}
      </Link>
    </header>
  );
};

import { CreateOrderForm } from "@/features/create-order/ui/CreateOrderForm";
import { useI18n } from "@/shared/i18n/use-i18n";

export const CreateOrderWorkspace = () => {
  const { t } = useI18n();

  return (
    <section className="grid gap-5">
      <header className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
          {t("pages.ordersCreate.eyebrow")}
        </span>
        <h1 className="my-[10px] text-[28px] leading-[1.15]">{t("pages.ordersCreate.title")}</h1>
        <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.ordersCreate.description")}</p>
      </header>

      <CreateOrderForm />
    </section>
  );
};

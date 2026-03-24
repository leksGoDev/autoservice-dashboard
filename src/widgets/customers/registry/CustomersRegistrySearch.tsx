import type { ChangeEventHandler } from "react";
import { useI18n } from "@/shared/i18n/use-i18n";

type CustomersRegistrySearchProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const CustomersRegistrySearch = ({ value, onChange }: CustomersRegistrySearchProps) => {
  const { t } = useI18n();

  return (
    <div className="flex items-center justify-between gap-3">
      <input
        className="w-full max-w-[440px] rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-3 py-2.5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
        type="search"
        value={value}
        placeholder={t("customersRegistry.searchPlaceholder")}
        aria-label={t("customersRegistry.searchAria")}
        onChange={onChange}
      />
    </div>
  );
};

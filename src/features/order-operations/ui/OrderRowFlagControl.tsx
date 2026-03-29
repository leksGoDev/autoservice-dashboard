import { useSetOrderFlagMutation } from "@/features/order-operations/api/mutations";
import { useI18n } from "@/shared/i18n/use-i18n";

type OrderRowFlagControlProps = {
  orderId: string;
  flagged: boolean;
};

export const OrderRowFlagControl = ({ orderId, flagged }: OrderRowFlagControlProps) => {
  const { t } = useI18n();
  const mutation = useSetOrderFlagMutation();

  const flagActionLabel =
    String(
      mutation.isPending
      ? t("pages.orders.operations.actions.flagPending")
      : flagged
        ? t("pages.orders.operations.actions.unflag")
        : t("pages.orders.operations.actions.flag"),
    );

  const handleToggle = async () => {
    await mutation.mutateAsync({
      orderId,
      flagged: !flagged,
    });
  };

  return (
    <button
      type="button"
      className="h-7 cursor-pointer rounded-[9px] border border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.14)] px-2.5 text-[11px] font-semibold text-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={handleToggle}
      disabled={mutation.isPending}
      aria-label={flagActionLabel}
      title={flagActionLabel}
    >
      {flagActionLabel}
    </button>
  );
};

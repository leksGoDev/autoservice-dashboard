import { useEffect, useMemo, useState } from "react";

import { useAssignOrderMechanicMutation } from "@/features/order-operations/api/mutations";
import { useI18n } from "@/shared/i18n/use-i18n";
import { InlineSelectControl } from "./InlineSelectControl";

type OrderRowMechanicControlProps = {
  orderId: string;
  assignedMechanic: string;
  mechanics: string[];
};

export const OrderRowMechanicControl = ({
  orderId,
  assignedMechanic,
  mechanics,
}: OrderRowMechanicControlProps) => {
  const { t } = useI18n();
  const mutation = useAssignOrderMechanicMutation();
  const [nextMechanic, setNextMechanic] = useState(assignedMechanic);

  useEffect(() => {
    setNextMechanic(assignedMechanic);
  }, [assignedMechanic]);

  const availableMechanics = useMemo(() => {
    const normalized = new Set(mechanics.filter((item) => item.trim().length > 0));

    if (assignedMechanic.trim().length > 0) {
      normalized.add(assignedMechanic);
    }

    return [...normalized].sort((left, right) => left.localeCompare(right));
  }, [assignedMechanic, mechanics]);

  const isDirty = nextMechanic !== assignedMechanic;
  const mechanicLabel = String(t("pages.orders.operations.mechanic"));
  const mechanicPendingLabel = String(t("pages.orders.operations.actions.mechanicPending"));
  const mechanicActionLabel = String(t("pages.orders.operations.actions.mechanic"));

  const handleSubmit = async () => {
    await mutation.mutateAsync({
      orderId,
      assignedMechanic: nextMechanic,
    });
  };

  return (
    <InlineSelectControl
      value={nextMechanic}
      options={availableMechanics.map((mechanic) => ({
        value: mechanic,
        label: mechanic,
      }))}
      ariaLabel={mechanicLabel}
      isBusy={mutation.isPending}
      isDirty={isDirty}
      isPending={mutation.isPending}
      pendingLabel={mechanicPendingLabel}
      actionLabel={mechanicActionLabel}
      onChange={setNextMechanic}
      onSubmit={handleSubmit}
    />
  );
};

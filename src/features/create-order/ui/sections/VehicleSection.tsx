import type { VehicleListItem } from "@/entities/vehicle/model/types";
import type { CreateOrderFormHandle } from "@/features/create-order/model/use-create-order-form";
import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { ExistingVehicleFields } from "./ExistingVehicleFields";
import { NewVehicleFields } from "./NewVehicleFields";

type VehicleSectionProps = {
  form: CreateOrderFormHandle;
  customerMode: "existing" | "new";
  mode: "existing" | "new";
  selectedCustomerId: string | undefined;
  vehicles: VehicleListItem[];
  canSelectExistingVehicle: boolean;
  isLoading: boolean;
};

export const VehicleSection = ({
  form,
  customerMode,
  mode,
  selectedCustomerId,
  vehicles,
  canSelectExistingVehicle,
  isLoading,
}: VehicleSectionProps) => {
  const { t } = useI18n();
  const {
    register,
    formState: { errors },
  } = form;
  const isExistingLocked = customerMode === "new";
  const isCustomerRequired = customerMode === "existing" && !selectedCustomerId;
  const getGuidanceMessage = () => {
    if (isExistingLocked) {
      return t("pages.ordersCreate.vehicle.helpers.existingDisabledForNewCustomer");
    }

    if (isCustomerRequired) {
      return t("pages.ordersCreate.vehicle.helpers.selectCustomerFirst");
    }

    if (!isLoading && mode === "existing" && vehicles.length === 0) {
      return t("pages.ordersCreate.vehicle.helpers.noVehiclesForCustomer");
    }

    return null;
  };

  const guidanceMessage = getGuidanceMessage();

  let modeFields = (
    <NewVehicleFields
      register={register}
      errors={errors}
    />
  );

  if (mode === "existing") {
    modeFields = (
      <ExistingVehicleFields
        register={register}
        errors={errors}
        vehicles={vehicles}
        isLocked={isExistingLocked}
        canSelectExistingVehicle={canSelectExistingVehicle}
        isLoading={isLoading}
      />
    );
  }

  return (
    <WidgetCard title={t("pages.ordersCreate.sections.vehicle")}>
      <div className="grid gap-3">
        <div className="flex flex-wrap gap-5 text-sm">
          <label
            className={[
              "inline-flex items-center gap-2",
              isExistingLocked ? "cursor-not-allowed opacity-60" : "",
            ].join(" ").trim()}
          >
            <input
              type="radio"
              value="existing"
              disabled={isExistingLocked}
              {...register("vehicleMode")}
            />
            <span>{t("pages.ordersCreate.vehicle.existing")}</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="new" {...register("vehicleMode")} />
            <span>{t("pages.ordersCreate.vehicle.new")}</span>
          </label>
        </div>
        {guidanceMessage ? (
          <p className="m-0 text-xs text-[var(--color-text-secondary)]">
            {guidanceMessage}
          </p>
        ) : null}
        {modeFields}
      </div>
    </WidgetCard>
  );
};

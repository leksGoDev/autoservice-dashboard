import type { VehicleListItem } from "@/entities/vehicle/model/types";
import type { CreateOrderFormHandle } from "@/features/create-order/model/use-create-order-form";
import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { errorTextClassName, fieldLabelClassName, fieldTitleClassName, inputClassName } from "./form-styles";

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
  const guidanceMessage = isExistingLocked
    ? t("pages.ordersCreate.vehicle.helpers.existingDisabledForNewCustomer")
    : isCustomerRequired
      ? t("pages.ordersCreate.vehicle.helpers.selectCustomerFirst")
      : !isLoading && mode === "existing" && vehicles.length === 0
        ? t("pages.ordersCreate.vehicle.helpers.noVehiclesForCustomer")
        : null;

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

        {mode === "existing" ? (
          <div className="grid gap-2">
            <label className={fieldLabelClassName}>
              <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.select")}</span>
              <select
                className={[
                  inputClassName,
                  "disabled:cursor-not-allowed disabled:opacity-60 disabled:text-[var(--color-text-secondary)]",
                ].join(" ")}
                disabled={isExistingLocked || !canSelectExistingVehicle || isLoading}
                {...register("existingVehicleId")}
              >
                <option value="">{t("pages.ordersCreate.common.selectPlaceholder")}</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model} · {vehicle.plateNumber}
                  </option>
                ))}
              </select>
              {errors.existingVehicleId ? <span className={errorTextClassName}>{errors.existingVehicleId.message}</span> : null}
            </label>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <label className={fieldLabelClassName}>
              <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.vin")}</span>
              <input className={inputClassName} {...register("newVehicleVin")} />
              {errors.newVehicleVin ? <span className={errorTextClassName}>{errors.newVehicleVin.message}</span> : null}
            </label>
            <label className={fieldLabelClassName}>
              <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.plate")}</span>
              <input className={inputClassName} {...register("newVehiclePlateNumber")} />
              {errors.newVehiclePlateNumber ? <span className={errorTextClassName}>{errors.newVehiclePlateNumber.message}</span> : null}
            </label>
            <label className={fieldLabelClassName}>
              <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.make")}</span>
              <input className={inputClassName} {...register("newVehicleMake")} />
              {errors.newVehicleMake ? <span className={errorTextClassName}>{errors.newVehicleMake.message}</span> : null}
            </label>
            <label className={fieldLabelClassName}>
              <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.model")}</span>
              <input className={inputClassName} {...register("newVehicleModel")} />
              {errors.newVehicleModel ? <span className={errorTextClassName}>{errors.newVehicleModel.message}</span> : null}
            </label>
            <label className={fieldLabelClassName}>
              <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.year")}</span>
              <input className={inputClassName} type="number" {...register("newVehicleYear", { valueAsNumber: true })} />
              {errors.newVehicleYear ? <span className={errorTextClassName}>{errors.newVehicleYear.message}</span> : null}
            </label>
          </div>
        )}
      </div>
    </WidgetCard>
  );
};

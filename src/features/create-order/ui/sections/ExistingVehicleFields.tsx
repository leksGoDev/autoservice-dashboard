import type { VehicleListItem } from "@/entities/vehicle/model/types";
import type { CreateOrderFormHandle } from "@/features/create-order/model/use-create-order-form";
import { useI18n } from "@/shared/i18n/use-i18n";
import { errorTextClassName, fieldLabelClassName, fieldTitleClassName, inputClassName } from "./form-styles";

type ExistingVehicleFieldsProps = {
  register: CreateOrderFormHandle["register"];
  errors: CreateOrderFormHandle["formState"]["errors"];
  vehicles: VehicleListItem[];
  isLocked: boolean;
  canSelectExistingVehicle: boolean;
  isLoading: boolean;
};

export const ExistingVehicleFields = ({
  register,
  errors,
  vehicles,
  isLocked,
  canSelectExistingVehicle,
  isLoading,
}: ExistingVehicleFieldsProps) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-2">
      <label className={fieldLabelClassName}>
        <span className={fieldTitleClassName}>{t("pages.ordersCreate.vehicle.select")}</span>
        <select
          className={[
            inputClassName,
            "disabled:cursor-not-allowed disabled:opacity-60 disabled:text-[var(--color-text-secondary)]",
          ].join(" ")}
          disabled={isLocked || !canSelectExistingVehicle || isLoading}
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
  );
};

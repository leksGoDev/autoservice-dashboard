import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCustomersListQuery } from "@/entities/customer/api/queries";
import { getMutationErrorMessage } from "@/features/order-operations/model/get-mutation-error-message";
import { useI18n } from "@/shared/i18n/use-i18n";
import {
  formFieldErrorTextClassName,
  formFieldInputClassName,
  formFieldLabelClassName,
  formPrimarySubmitButtonClassName,
  formSecondaryButtonClassName,
} from "@/shared/ui/class-names";
import { useCreateVehicleMutation } from "../api/mutations";
import {
  createVehicleFormSchema,
  getCreateVehicleFormDefaultValues,
  type CreateVehicleFormInput,
  type CreateVehicleFormValues,
} from "../model/schema";

type CreateVehicleFormProps = {
  onSubmitted?: () => void;
  onCancel?: () => void;
};

const customersListParams = {
  page: 1,
  pageSize: 100,
} as const;

export const CreateVehicleForm = ({ onSubmitted, onCancel }: CreateVehicleFormProps) => {
  const { t } = useI18n();
  const createMutation = useCreateVehicleMutation();
  const customersQuery = useCustomersListQuery(customersListParams);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CreateVehicleFormInput, unknown, CreateVehicleFormValues>({
    resolver: zodResolver(createVehicleFormSchema),
    defaultValues: getCreateVehicleFormDefaultValues(),
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await createMutation.mutateAsync(values);
      reset(getCreateVehicleFormDefaultValues());
      onSubmitted?.();
    } catch (error) {
      setSubmitError(getMutationErrorMessage(error, t("pages.vehicles.form.error")));
    }
  });

  return (
    <form className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[rgba(15,17,21,0.35)] p-4" onSubmit={submit}>
      <h3 className="m-0 text-sm font-semibold text-[var(--color-text-primary)]">{t("pages.vehicles.form.createTitle")}</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <label className={formFieldLabelClassName}>
          <span>{t("pages.vehicles.form.customer")}</span>
          <select
            className={formFieldInputClassName}
            {...register("customerId")}
            disabled={customersQuery.isLoading || customersQuery.isError || createMutation.isPending}
          >
            <option value="">{t("pages.ordersCreate.common.selectPlaceholder")}</option>
            {(customersQuery.data?.items ?? []).map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.fullName} · {customer.phone}
              </option>
            ))}
          </select>
          {errors.customerId ? <span className={formFieldErrorTextClassName}>{errors.customerId.message}</span> : null}
        </label>

        <label className={formFieldLabelClassName}>
          <span>{t("pages.ordersCreate.vehicle.vin")}</span>
          <input className={formFieldInputClassName} {...register("vin")} />
          {errors.vin ? <span className={formFieldErrorTextClassName}>{errors.vin.message}</span> : null}
        </label>

        <label className={formFieldLabelClassName}>
          <span>{t("pages.ordersCreate.vehicle.plate")}</span>
          <input className={formFieldInputClassName} {...register("plateNumber")} />
          {errors.plateNumber ? <span className={formFieldErrorTextClassName}>{errors.plateNumber.message}</span> : null}
        </label>

        <label className={formFieldLabelClassName}>
          <span>{t("pages.ordersCreate.vehicle.make")}</span>
          <input className={formFieldInputClassName} {...register("make")} />
          {errors.make ? <span className={formFieldErrorTextClassName}>{errors.make.message}</span> : null}
        </label>

        <label className={formFieldLabelClassName}>
          <span>{t("pages.ordersCreate.vehicle.model")}</span>
          <input className={formFieldInputClassName} {...register("model")} />
          {errors.model ? <span className={formFieldErrorTextClassName}>{errors.model.message}</span> : null}
        </label>

        <label className={formFieldLabelClassName}>
          <span>{t("pages.ordersCreate.vehicle.year")}</span>
          <input className={formFieldInputClassName} type="number" {...register("year", { valueAsNumber: true })} />
          {errors.year ? <span className={formFieldErrorTextClassName}>{errors.year.message}</span> : null}
        </label>
      </div>

      {customersQuery.isError ? <p className="m-0 text-xs text-[#fecaca]">{t("pages.vehicles.form.customersError")}</p> : null}
      {submitError ? <p className="m-0 text-xs text-[#fecaca]">{submitError}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className={formPrimarySubmitButtonClassName}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? t("pages.vehicles.form.submitting") : t("pages.vehicles.form.createAction")}
        </button>

        {onCancel ? (
          <button
            type="button"
            className={formSecondaryButtonClassName}
            onClick={onCancel}
            disabled={createMutation.isPending}
          >
            {t("pages.vehicles.form.cancelAction")}
          </button>
        ) : null}
      </div>
    </form>
  );
};

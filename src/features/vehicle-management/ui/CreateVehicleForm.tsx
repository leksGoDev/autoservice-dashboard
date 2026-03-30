import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCustomersListQuery } from "@/entities/customer/api/queries";
import { getMutationErrorMessage } from "@/features/order-operations/model/get-mutation-error-message";
import { useI18n } from "@/shared/i18n/use-i18n";
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

const inputClassName =
  "w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]";
const labelClassName = "grid gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)]";
const errorTextClassName = "text-xs text-[#fecaca]";

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
        <label className={labelClassName}>
          <span>{t("pages.vehicles.form.customer")}</span>
          <select
            className={inputClassName}
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
          {errors.customerId ? <span className={errorTextClassName}>{errors.customerId.message}</span> : null}
        </label>

        <label className={labelClassName}>
          <span>{t("pages.ordersCreate.vehicle.vin")}</span>
          <input className={inputClassName} {...register("vin")} />
          {errors.vin ? <span className={errorTextClassName}>{errors.vin.message}</span> : null}
        </label>

        <label className={labelClassName}>
          <span>{t("pages.ordersCreate.vehicle.plate")}</span>
          <input className={inputClassName} {...register("plateNumber")} />
          {errors.plateNumber ? <span className={errorTextClassName}>{errors.plateNumber.message}</span> : null}
        </label>

        <label className={labelClassName}>
          <span>{t("pages.ordersCreate.vehicle.make")}</span>
          <input className={inputClassName} {...register("make")} />
          {errors.make ? <span className={errorTextClassName}>{errors.make.message}</span> : null}
        </label>

        <label className={labelClassName}>
          <span>{t("pages.ordersCreate.vehicle.model")}</span>
          <input className={inputClassName} {...register("model")} />
          {errors.model ? <span className={errorTextClassName}>{errors.model.message}</span> : null}
        </label>

        <label className={labelClassName}>
          <span>{t("pages.ordersCreate.vehicle.year")}</span>
          <input className={inputClassName} type="number" {...register("year", { valueAsNumber: true })} />
          {errors.year ? <span className={errorTextClassName}>{errors.year.message}</span> : null}
        </label>
      </div>

      {customersQuery.isError ? <p className="m-0 text-xs text-[#fecaca]">{t("pages.vehicles.form.customersError")}</p> : null}
      {submitError ? <p className="m-0 text-xs text-[#fecaca]">{submitError}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.2)] px-3 text-xs leading-4 font-medium text-[var(--color-text-primary)]"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? t("pages.vehicles.form.submitting") : t("pages.vehicles.form.createAction")}
        </button>

        {onCancel ? (
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-3 text-xs leading-4 font-medium text-[var(--color-text-secondary)]"
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

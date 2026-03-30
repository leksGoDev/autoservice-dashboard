import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getMutationErrorMessage } from "@/features/order-operations/model/get-mutation-error-message";
import { useI18n } from "@/shared/i18n/use-i18n";
import { useCreateCustomerMutation, useUpdateCustomerMutation } from "../api/mutations";
import {
  customerFormSchema,
  getCustomerFormDefaultValues,
  type CustomerFormInput,
  type CustomerFormValues,
} from "../model/schema";

type CustomerFormProps = {
  mode: "create" | "edit";
  customerId?: string;
  initialValues?: Partial<CustomerFormInput>;
  onSubmitted?: () => void;
  onCancel?: () => void;
};

const inputClassName =
  "w-full rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]";
const labelClassName = "grid gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)]";
const errorTextClassName = "text-xs text-[#fecaca]";

export const CustomerForm = ({ mode, customerId, initialValues, onSubmitted, onCancel }: CustomerFormProps) => {
  const { t } = useI18n();
  const createMutation = useCreateCustomerMutation();
  const updateMutation = useUpdateCustomerMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CustomerFormInput, unknown, CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: getCustomerFormDefaultValues(initialValues),
    mode: "onTouched",
  });

  useEffect(() => {
    form.reset(getCustomerFormDefaultValues(initialValues));
  }, [form, initialValues]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(values);
        reset(getCustomerFormDefaultValues());
      }

      if (mode === "edit") {
        if (!customerId) {
          throw new Error("Customer id is required");
        }

        await updateMutation.mutateAsync({
          customerId,
          payload: values,
        });
      }

      onSubmitted?.();
    } catch (error) {
      setSubmitError(getMutationErrorMessage(error, t("pages.customers.form.error")));
    }
  });

  return (
    <form className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[rgba(15,17,21,0.35)] p-4" onSubmit={submit}>
      <h3 className="m-0 text-sm font-semibold text-[var(--color-text-primary)]">
        {mode === "create" ? t("pages.customers.form.createTitle") : t("pages.customerDetails.form.editTitle")}
      </h3>

      <div className="grid gap-3 md:grid-cols-2">
        <label className={labelClassName}>
          <span>{t("pages.ordersCreate.customer.fullName")}</span>
          <input className={inputClassName} {...register("fullName")} />
          {errors.fullName ? <span className={errorTextClassName}>{errors.fullName.message}</span> : null}
        </label>

        <label className={labelClassName}>
          <span>{t("pages.ordersCreate.customer.phone")}</span>
          <input className={inputClassName} {...register("phone")} />
          {errors.phone ? <span className={errorTextClassName}>{errors.phone.message}</span> : null}
        </label>

        <label className={labelClassName}>
          <span>{t("pages.ordersCreate.customer.email")}</span>
          <input className={inputClassName} type="email" {...register("email")} />
          {errors.email ? <span className={errorTextClassName}>{errors.email.message}</span> : null}
        </label>

        <label className={labelClassName}>
          <span>{t("pages.ordersCreate.customer.loyalty")}</span>
          <select className={inputClassName} {...register("loyaltyTier")}>
            <option value="standard">{t("customer.loyaltyTier.standard")}</option>
            <option value="silver">{t("customer.loyaltyTier.silver")}</option>
            <option value="gold">{t("customer.loyaltyTier.gold")}</option>
          </select>
          {errors.loyaltyTier ? <span className={errorTextClassName}>{errors.loyaltyTier.message}</span> : null}
        </label>
      </div>

      {submitError ? <p className="m-0 text-xs text-[#fecaca]">{submitError}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.2)] px-3 text-xs leading-4 font-medium text-[var(--color-text-primary)]"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("pages.customers.form.submitting")
            : mode === "create"
              ? t("pages.customers.form.createAction")
              : t("pages.customerDetails.form.saveAction")}
        </button>

        {onCancel ? (
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-3 text-xs leading-4 font-medium text-[var(--color-text-secondary)]"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t("pages.customers.form.cancelAction")}
          </button>
        ) : null}
      </div>
    </form>
  );
};

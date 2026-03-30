import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getMutationErrorMessage } from "@/features/order-operations/model/get-mutation-error-message";
import { useI18n } from "@/shared/i18n/use-i18n";
import {
  formFieldErrorTextClassName,
  formFieldInputClassName,
  formFieldLabelClassName,
  formPrimarySubmitButtonClassName,
  formSecondaryButtonClassName,
} from "@/shared/ui/class-names";
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
        <label className={formFieldLabelClassName}>
          <span>{t("pages.ordersCreate.customer.fullName")}</span>
          <input className={formFieldInputClassName} {...register("fullName")} />
          {errors.fullName ? <span className={formFieldErrorTextClassName}>{errors.fullName.message}</span> : null}
        </label>

        <label className={formFieldLabelClassName}>
          <span>{t("pages.ordersCreate.customer.phone")}</span>
          <input className={formFieldInputClassName} {...register("phone")} />
          {errors.phone ? <span className={formFieldErrorTextClassName}>{errors.phone.message}</span> : null}
        </label>

        <label className={formFieldLabelClassName}>
          <span>{t("pages.ordersCreate.customer.email")}</span>
          <input className={formFieldInputClassName} type="email" {...register("email")} />
          {errors.email ? <span className={formFieldErrorTextClassName}>{errors.email.message}</span> : null}
        </label>

        <label className={formFieldLabelClassName}>
          <span>{t("pages.ordersCreate.customer.loyalty")}</span>
          <select className={formFieldInputClassName} {...register("loyaltyTier")}>
            <option value="standard">{t("customer.loyaltyTier.standard")}</option>
            <option value="silver">{t("customer.loyaltyTier.silver")}</option>
            <option value="gold">{t("customer.loyaltyTier.gold")}</option>
          </select>
          {errors.loyaltyTier ? <span className={formFieldErrorTextClassName}>{errors.loyaltyTier.message}</span> : null}
        </label>
      </div>

      {submitError ? <p className="m-0 text-xs text-[#fecaca]">{submitError}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className={formPrimarySubmitButtonClassName}
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
            className={formSecondaryButtonClassName}
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

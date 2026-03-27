import type { CustomerListItem } from "@/entities/customer/model/types";
import type { CreateOrderFormHandle } from "@/features/create-order/model/use-create-order-form-model";
import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { errorTextClassName, fieldLabelClassName, fieldTitleClassName, inputClassName } from "./form-styles";

type CustomerSectionProps = {
  form: CreateOrderFormHandle;
  mode: "existing" | "new";
  customers: CustomerListItem[];
};

export const CustomerSection = ({ form, mode, customers }: CustomerSectionProps) => {
  const { t } = useI18n();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <WidgetCard title={t("pages.ordersCreate.sections.customer")}>
      <div className="grid gap-3">
        <div className="flex flex-wrap gap-5 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="existing" {...register("customerMode")} />
            <span>{t("pages.ordersCreate.customer.existing")}</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="new" {...register("customerMode")} />
            <span>{t("pages.ordersCreate.customer.new")}</span>
          </label>
        </div>

        {mode === "existing" ? (
          <label className={fieldLabelClassName}>
            <span className={fieldTitleClassName}>{t("pages.ordersCreate.customer.select")}</span>
            <select className={inputClassName} {...register("existingCustomerId")}>
              <option value="">{t("pages.ordersCreate.common.selectPlaceholder")}</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.fullName} · {customer.phone}
                </option>
              ))}
            </select>
            {errors.existingCustomerId ? <span className={errorTextClassName}>{errors.existingCustomerId.message}</span> : null}
          </label>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <label className={fieldLabelClassName}>
              <span className={fieldTitleClassName}>{t("pages.ordersCreate.customer.fullName")}</span>
              <input className={inputClassName} {...register("newCustomerFullName")} />
              {errors.newCustomerFullName ? <span className={errorTextClassName}>{errors.newCustomerFullName.message}</span> : null}
            </label>

            <label className={fieldLabelClassName}>
              <span className={fieldTitleClassName}>{t("pages.ordersCreate.customer.phone")}</span>
              <input className={inputClassName} {...register("newCustomerPhone")} />
              {errors.newCustomerPhone ? <span className={errorTextClassName}>{errors.newCustomerPhone.message}</span> : null}
            </label>

            <label className={fieldLabelClassName}>
              <span className={fieldTitleClassName}>{t("pages.ordersCreate.customer.email")}</span>
              <input className={inputClassName} type="email" {...register("newCustomerEmail")} />
              {errors.newCustomerEmail ? <span className={errorTextClassName}>{errors.newCustomerEmail.message}</span> : null}
            </label>

            <label className={fieldLabelClassName}>
              <span className={fieldTitleClassName}>{t("pages.ordersCreate.customer.loyalty")}</span>
              <select className={inputClassName} {...register("newCustomerLoyaltyTier")}>
                <option value="standard">{t("customer.loyaltyTier.standard")}</option>
                <option value="silver">{t("customer.loyaltyTier.silver")}</option>
                <option value="gold">{t("customer.loyaltyTier.gold")}</option>
              </select>
            </label>
          </div>
        )}
      </div>
    </WidgetCard>
  );
};

import type { CustomerVehicleListItem } from "@/entities/customer/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";

type CustomerVehiclesTableProps = {
  rows: CustomerVehicleListItem[];
};

export const CustomerVehiclesTable = ({ rows }: CustomerVehiclesTableProps) => {
  const { t } = useI18n();

  return (
    <article className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4">
      <h2 className="m-0 text-base font-bold">{t("pages.customerDetails.sections.vehicles")}</h2>
      {rows.length === 0 ? (
        <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.customerDetails.states.emptyVehicles")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[740px] w-full border-collapse text-left text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.customerDetails.vehicles.plateNumber")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.customerDetails.vehicles.vin")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.customerDetails.vehicles.make")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.customerDetails.vehicles.model")}
                </th>
                <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                  {t("pages.customerDetails.vehicles.year")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((vehicle) => (
                <tr key={vehicle.id} className="transition-colors hover:bg-[#20283a]">
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{vehicle.plateNumber}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{vehicle.vin}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{vehicle.make}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{vehicle.model}</td>
                  <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{vehicle.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
};

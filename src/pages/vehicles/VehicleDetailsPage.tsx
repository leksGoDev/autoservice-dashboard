import { Link, useParams } from "react-router-dom";
import { useVehicleDetailsQuery, useVehicleServiceHistoryQuery } from "@/entities/vehicle/api/queries";
import { useI18n } from "@/shared/i18n/use-i18n";

export const VehicleDetailsPage = () => {
  const { t } = useI18n();
  const { vehicleId } = useParams();
  const detailsQuery = useVehicleDetailsQuery(vehicleId);
  const historyQuery = useVehicleServiceHistoryQuery(vehicleId);

  const isLoading = detailsQuery.isLoading || historyQuery.isLoading;
  const isError = detailsQuery.isError || historyQuery.isError;
  const details = detailsQuery.data;
  const history = historyQuery.data ?? [];
  const hasData = Boolean(details);

  return (
    <section className="grid gap-5">
      <header className="grid gap-[10px] rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
        <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
          {t("pages.vehicleDetails.eyebrow")}
        </span>
        <h1 className="m-0 text-[28px] leading-[1.15]">{t("pages.vehicleDetails.title")}</h1>
        <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.description")}</p>
        <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.vehicleId", { vehicleId })}</p>
        <Link
          to="/vehicles"
          className="inline-flex w-fit rounded-full border border-[rgba(107,164,255,0.35)] bg-[rgba(107,164,255,0.14)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--color-accent-light-blue)] transition-colors hover:bg-[rgba(107,164,255,0.2)]"
        >
          {t("pages.vehicleDetails.back")}
        </Link>
      </header>

      {isLoading ? (
        <section className="rounded-2xl border border-[rgba(154,164,178,0.18)] bg-[rgba(27,33,48,0.9)] px-[18px] py-[18px] text-[var(--color-text-secondary)]">
          {t("pages.vehicleDetails.states.loading")}
        </section>
      ) : null}

      {isError ? (
        <section className="grid gap-3 rounded-2xl border border-[rgba(239,68,68,0.4)] bg-[rgba(27,33,48,0.9)] px-[18px] py-[18px] text-[#fecaca]">
          <span>{t("pages.vehicleDetails.states.error")}</span>
          <button
            type="button"
            className="justify-self-start rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={() => {
              detailsQuery.refetch();
              historyQuery.refetch();
            }}
          >
            {t("common.retry")}
          </button>
        </section>
      ) : null}

      {!isLoading && !isError && !hasData ? (
        <section className="rounded-2xl border border-[rgba(154,164,178,0.18)] bg-[rgba(27,33,48,0.9)] px-[18px] py-[18px] text-[var(--color-text-secondary)]">
          {t("pages.vehicleDetails.states.empty")}
        </section>
      ) : null}

      {!isLoading && !isError && details ? (
        <div className="grid gap-4 md:grid-cols-[minmax(320px,1fr)_minmax(320px,1fr)]">
          <article className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4">
            <h2 className="m-0 text-base font-bold">{t("pages.vehicleDetails.sections.info")}</h2>
            <dl className="grid gap-3">
              <div className="grid gap-1">
                <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
                  {t("pages.vehicleDetails.labels.vehicleId")}
                </dt>
                <dd className="m-0">{details.id}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
                  {t("pages.vehicleDetails.labels.plateNumber")}
                </dt>
                <dd className="m-0">{details.plateNumber}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
                  {t("pages.vehicleDetails.labels.vin")}
                </dt>
                <dd className="m-0">{details.vin}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
                  {t("pages.vehicleDetails.labels.makeModel")}
                </dt>
                <dd className="m-0">{`${details.make} ${details.model}`}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
                  {t("pages.vehicleDetails.labels.year")}
                </dt>
                <dd className="m-0">{details.year}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
                  {t("pages.vehicleDetails.labels.owner")}
                </dt>
                <dd className="m-0">{details.owner}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="m-0 text-[11px] uppercase tracking-[0.03em] text-[var(--color-text-secondary)]">
                  {t("pages.vehicleDetails.labels.ordersCount")}
                </dt>
                <dd className="m-0">{details.ordersCount}</dd>
              </div>
            </dl>
          </article>

          <article className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4">
            <h2 className="m-0 text-base font-bold">{t("pages.vehicleDetails.sections.history")}</h2>
            {history.length === 0 ? (
              <p className="m-0 text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.states.emptyHistory")}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[720px] w-full border-collapse text-left text-[13px]">
                  <thead>
                    <tr>
                      <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.history.order")}</th>
                      <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.history.status")}</th>
                      <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.history.total")}</th>
                      <th className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 text-[12px] font-semibold text-[var(--color-text-secondary)]">{t("pages.vehicleDetails.history.updated")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.orderId} className="transition-colors hover:bg-[#20283a]">
                        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle font-mono text-[13px] text-[#c9d1dd]">{item.orderNumber}</td>
                        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{t(`order.status.${item.status}`)}</td>
                        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{`$${item.totalAmount.toLocaleString()}`}</td>
                        <td className="border-b border-[rgba(154,164,178,0.12)] px-3 py-2.5 align-middle">{new Date(item.updatedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </div>
      ) : null}
    </section>
  );
};

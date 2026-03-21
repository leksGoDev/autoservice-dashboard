import "@/widgets/vehicles-registry/vehicles-registry.css";

import type { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useVehicleDetailsQuery, useVehicleServiceHistoryQuery } from "@/entities/vehicle/api/queries";
import { useI18n } from "@/shared/i18n/use-i18n";

export const VehicleDetailsPage: FC = () => {
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
    <section className="vehicles-page">
      <header className="vehicles-page__hero">
        <span className="vehicles-page__eyebrow">{t("pages.vehicleDetails.eyebrow")}</span>
        <h1 className="vehicles-page__title">{t("pages.vehicleDetails.title")}</h1>
        <p className="vehicles-page__description">{t("pages.vehicleDetails.description")}</p>
        <Link to="/vehicles" className="vehicles-table__action">
          {t("pages.vehicleDetails.back")}
        </Link>
      </header>

      {isLoading ? <section className="vehicles-state">{t("pages.vehicleDetails.states.loading")}</section> : null}

      {isError ? (
        <section className="vehicles-state vehicles-state--error">
          <span>{t("pages.vehicleDetails.states.error")}</span>
          <button type="button" className="vehicles-state__retry" onClick={() => {
            detailsQuery.refetch();
            historyQuery.refetch();
          }}>
            {t("common.retry")}
          </button>
        </section>
      ) : null}

      {!isLoading && !isError && !hasData ? (
        <section className="vehicles-state">{t("pages.vehicleDetails.states.empty")}</section>
      ) : null}

      {!isLoading && !isError && details ? (
        <div className="vehicle-details-grid">
          <article className="vehicle-details-card">
            <h2 className="vehicle-details-card__title">{t("pages.vehicleDetails.sections.info")}</h2>
            <dl className="vehicle-details-info">
              <div>
                <dt>{t("pages.vehicleDetails.labels.vehicleId")}</dt>
                <dd>{details.id}</dd>
              </div>
              <div>
                <dt>{t("pages.vehicleDetails.labels.plateNumber")}</dt>
                <dd>{details.plateNumber}</dd>
              </div>
              <div>
                <dt>{t("pages.vehicleDetails.labels.vin")}</dt>
                <dd>{details.vin}</dd>
              </div>
              <div>
                <dt>{t("pages.vehicleDetails.labels.makeModel")}</dt>
                <dd>{`${details.make} ${details.model}`}</dd>
              </div>
              <div>
                <dt>{t("pages.vehicleDetails.labels.year")}</dt>
                <dd>{details.year}</dd>
              </div>
              <div>
                <dt>{t("pages.vehicleDetails.labels.owner")}</dt>
                <dd>{details.owner}</dd>
              </div>
              <div>
                <dt>{t("pages.vehicleDetails.labels.ordersCount")}</dt>
                <dd>{details.ordersCount}</dd>
              </div>
            </dl>
          </article>

          <article className="vehicle-details-card">
            <h2 className="vehicle-details-card__title">{t("pages.vehicleDetails.sections.history")}</h2>
            {history.length === 0 ? (
              <p className="vehicles-page__description">{t("pages.vehicleDetails.states.emptyHistory")}</p>
            ) : (
              <div className="vehicles-registry__table-wrap">
                <table className="vehicles-table">
                  <thead>
                    <tr>
                      <th>{t("pages.vehicleDetails.history.order")}</th>
                      <th>{t("pages.vehicleDetails.history.status")}</th>
                      <th>{t("pages.vehicleDetails.history.total")}</th>
                      <th>{t("pages.vehicleDetails.history.updated")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.orderId}>
                        <td className="vehicles-table__mono">{item.orderNumber}</td>
                        <td>{t(`order.status.${item.status}`)}</td>
                        <td>{`$${item.totalAmount.toLocaleString()}`}</td>
                        <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
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

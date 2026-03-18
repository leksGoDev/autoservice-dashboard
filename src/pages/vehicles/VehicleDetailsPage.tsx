import "@/widgets/vehicles-registry/vehicles-registry.css";

import type { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "@/shared/i18n/use-i18n";

export const VehicleDetailsPage: FC = () => {
  const { t } = useI18n();
  const { vehicleId } = useParams();

  return (
    <section className="vehicles-page">
      <header className="vehicles-page__hero">
        <span className="vehicles-page__eyebrow">{t("pages.vehicleDetails.eyebrow")}</span>
        <h1 className="vehicles-page__title">{t("pages.vehicleDetails.title")}</h1>
        <p className="vehicles-page__description">{t("pages.vehicleDetails.description")}</p>
        <p className="vehicles-page__description">{t("pages.vehicleDetails.vehicleId", { vehicleId })}</p>
        <Link to="/vehicles" className="vehicles-table__action">
          {t("pages.vehicleDetails.back")}
        </Link>
      </header>
    </section>
  );
};

import { NavLink } from "react-router-dom";

import { useI18n } from "@/shared/i18n/use-i18n";

const navigation = [
  { to: "/dashboard", labelKey: "nav.dashboard" },
  { to: "/orders", labelKey: "nav.orders" },
  { to: "/customers", labelKey: "nav.customers" },
  { to: "/vehicles", labelKey: "nav.vehicles" },
  { to: "/mechanics", labelKey: "nav.mechanics" },
  { to: "/analytics", labelKey: "nav.analytics" },
  { to: "/work-board", labelKey: "nav.workBoard" },
];

export function AppSidebar() {
  const { t } = useI18n();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__eyebrow">{t("sidebar.eyebrow")}</span>
        <span className="sidebar__title">{t("sidebar.title")}</span>
      </div>

      <nav className="sidebar__nav" aria-label={t("sidebar.navAria")}>
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

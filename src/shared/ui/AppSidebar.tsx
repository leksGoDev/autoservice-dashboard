import { NavLink } from "react-router-dom";

import { useI18n } from "@/shared/i18n/use-i18n";
import styles from "./AppSidebar.module.css";

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
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.eyebrow}>{t("sidebar.eyebrow")}</span>
        <span className={styles.title}>{t("sidebar.title")}</span>
      </div>

      <nav className={styles.nav} aria-label={t("sidebar.navAria")}>
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.linkActive}` : styles.link
            }
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

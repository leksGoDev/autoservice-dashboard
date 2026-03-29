import { NavLink } from "react-router-dom";

import { useI18n } from "@/shared/i18n/use-i18n";
import styles from "./AppSidebar.module.css";

const navigation = [
  { to: "/dashboard", labelKey: "nav.dashboard" },
  { to: "/orders", labelKey: "nav.orders" },
  { to: "/appointments", labelKey: "nav.appointments" },
  { to: "/customers", labelKey: "nav.customers" },
  { to: "/vehicles", labelKey: "nav.vehicles" },
  { to: "/mechanics", labelKey: "nav.mechanics" },
  { to: "/analytics", labelKey: "nav.analytics" },
  { to: "/work-board", labelKey: "nav.workBoard" },
];

export function AppSidebar() {
  const { t } = useI18n();

  return (
    <aside
      className={`${styles.sidebarSurface} flex flex-col gap-6 border-b border-[var(--color-border)] px-4 py-6 max-[960px]:gap-4 md:border-r md:border-b-0`}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
          {t("sidebar.eyebrow")}
        </span>
        <span className="text-lg font-bold">{t("sidebar.title")}</span>
      </div>

      <nav
        className="grid gap-2 max-[960px]:grid-cols-2"
        aria-label={t("sidebar.navAria")}
      >
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "rounded-xl border border-transparent px-3.5 py-3 text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-white/[0.03] hover:text-[var(--color-text-primary)]",
                isActive ? styles.linkActive : "",
              ].join(" ").trim()
            }
          >
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

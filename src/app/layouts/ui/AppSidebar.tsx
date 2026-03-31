import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarClock,
  Car,
  ClipboardList,
  Columns3,
  LayoutDashboard,
  Users,
  Wrench,
} from "lucide-react";

import { useI18n } from "@/shared/i18n/use-i18n";
import styles from "./AppSidebar.module.css";

type SidebarNavigationItem = {
  to: string;
  labelKey: string;
  icon: LucideIcon;
};

const navigation = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/work-board", labelKey: "nav.workBoard", icon: Columns3 },
  { to: "/orders", labelKey: "nav.orders", icon: ClipboardList },
  { to: "/appointments", labelKey: "nav.appointments", icon: CalendarClock },
  { to: "/customers", labelKey: "nav.customers", icon: Users },
  { to: "/vehicles", labelKey: "nav.vehicles", icon: Car },
  { to: "/mechanics", labelKey: "nav.mechanics", icon: Wrench },
  { to: "/analytics", labelKey: "nav.analytics", icon: BarChart3 },
] satisfies SidebarNavigationItem[];

const navLinkClassName =
  "flex items-center gap-2.5 rounded-xl border border-transparent px-3.5 py-3 text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-white/[0.03] hover:text-[var(--color-text-primary)]";

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
              [navLinkClassName, isActive ? styles.linkActive : ""].join(" ").trim()
            }
          >
            <item.icon
              size={16}
              strokeWidth={2}
              aria-hidden
              className="shrink-0 opacity-85"
            />
            <span className="truncate">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

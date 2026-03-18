import { Outlet, useMatches } from "react-router-dom";

import { useI18n } from "@/shared/i18n/use-i18n";
import { AppSidebar } from "../../shared/ui/AppSidebar";
import { AppTopbar } from "../../shared/ui/AppTopbar";

type RouteHandle = {
  titleKey?: string;
};

export function AppShell() {
  const { t } = useI18n();
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const titleKey = (currentMatch?.handle as RouteHandle | undefined)?.titleKey ?? "routes.dashboard";
  const title = t(titleKey);

  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-shell__content">
        <AppTopbar title={title} />
        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

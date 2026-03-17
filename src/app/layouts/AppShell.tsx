import { Outlet, useMatches } from "react-router-dom";

import { AppSidebar } from "../../shared/ui/AppSidebar";
import { AppTopbar } from "../../shared/ui/AppTopbar";

type RouteHandle = {
  title?: string;
};

export function AppShell() {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const title = (currentMatch?.handle as RouteHandle | undefined)?.title ?? "Dashboard";

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

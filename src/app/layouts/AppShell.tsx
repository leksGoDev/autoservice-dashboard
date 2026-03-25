import { Suspense } from "react";
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
    <div className="grid min-h-screen grid-cols-[248px_1fr] max-[960px]:grid-cols-1">
      <AppSidebar />
      <div className="flex min-w-0 flex-col">
        <AppTopbar title={title} />
        <main className="p-6">
          <Suspense
            fallback={
              <div className="flex min-h-[220px] items-center justify-center text-sm text-[var(--color-text-secondary)]">
                {t("common.pageLoading")}
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

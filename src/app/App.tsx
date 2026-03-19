import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";
import { I18nProvider } from "@/shared/i18n/provider";
import { useI18n } from "@/shared/i18n/use-i18n";

import { queryClient } from "./providers/query-client";
import { router } from "./router";

const AppContent = () => {
  const { t } = useI18n();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const dismissUpdate = () => {
    setNeedRefresh(false);
  };

  return (
    <>
      {needRefresh ? (
        <div className="border-b border-[rgba(107,164,255,0.28)] bg-[rgba(21,25,34,0.92)] px-6 py-4">
          <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="grid gap-1">
              <strong className="text-sm font-semibold text-[var(--color-text-primary)]">
                {t("pwa.updateTitle")}
              </strong>
              <p className="m-0 text-sm text-[var(--color-text-secondary)]">{t("pwa.updateBody")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm font-semibold text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent-light-blue)] hover:text-[var(--color-text-primary)]"
                onClick={dismissUpdate}
              >
                {t("pwa.dismiss")}
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-[var(--color-accent-light-blue)] px-3 py-2 text-sm font-semibold text-[#0b0e14] transition hover:bg-[#7db0ff]"
                onClick={() => void updateServiceWorker(true)}
              >
                {t("pwa.reload")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <RouterProvider router={router} />
    </>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </QueryClientProvider>
  );
}

export async function enableMocking() {
  const shouldEnableMocking = import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === "true";

  if (!shouldEnableMocking) {
    return;
  }

  const { worker } = await import("./browser");

  await worker.start({
    onUnhandledRequest: "bypass",
    quiet: true,
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  });
}

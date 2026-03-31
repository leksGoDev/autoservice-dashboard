export async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("./browser");

  await worker.start({
    onUnhandledRequest: "bypass",
    quiet: true,
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });
}

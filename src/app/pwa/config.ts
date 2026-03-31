const normalizeBasePath = (basePath: string) => {
  if (basePath === "/") {
    return "/";
  }

  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
};

export const createPwaManifest = (basePath = "/") => {
  const normalizedBasePath = normalizeBasePath(basePath);

  return {
    name: "Autoservice Operations Dashboard",
    short_name: "Autoservice Ops",
    description: "Operations dashboard for managing orders, vehicles, customers, and workshop activity.",
    theme_color: "#0f1115",
    background_color: "#0f1115",
    display: "standalone",
    start_url: basePath,
    scope: basePath,
    icons: [
      {
        src: `${normalizedBasePath}/pwa-icon-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${normalizedBasePath}/pwa-icon-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  } as const;
};

export const pwaManifest = createPwaManifest();

export const pwaWorkbox = {
  globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
  navigateFallback: "index.html",
} as const;

export const pwaManifest = {
  name: "Autoservice Operations Dashboard",
  short_name: "Autoservice Ops",
  description: "Operations dashboard for managing orders, vehicles, customers, and workshop activity.",
  theme_color: "#0f1115",
  background_color: "#0f1115",
  display: "standalone",
  start_url: "/",
  scope: "/",
  icons: [
    {
      src: "/pwa-icon-192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/pwa-icon-512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
} as const;

export const pwaWorkbox = {
  globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
  navigateFallback: "index.html",
} as const;

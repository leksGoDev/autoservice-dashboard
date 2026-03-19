import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const createManifestIcon = (size: number) => {
  const icon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <rect width="512" height="512" rx="112" fill="#0f1115" />
      <rect x="72" y="92" width="368" height="328" rx="88" fill="#151922" stroke="#2a3142" stroke-width="20" />
      <path d="M152 340h208" stroke="#6ba4ff" stroke-width="28" stroke-linecap="round" />
      <path d="M176 204h160l24 56H152l24-56Z" fill="#003a8f" />
      <circle cx="184" cy="340" r="30" fill="#e6eaf2" />
      <circle cx="328" cy="340" r="30" fill="#e6eaf2" />
      <path
        d="M288 134l18 18-26 26 20 20 26-26 18 18-26 26 20 20-18 18-20-20-26 26-18-18 26-26-20-20-26 26-18-18 26-26-20-20 18-18 20 20 26-26Z"
        fill="#e7222a"
      />
    </svg>
  `;

  return {
    src: `data:image/svg+xml,${encodeURIComponent(icon)}`,
    sizes: `${size}x${size}`,
    type: "image/svg+xml",
    purpose: "any maskable",
  };
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      manifest: {
        name: "Autoservice Operations Dashboard",
        short_name: "Autoservice Ops",
        description: "Operations dashboard for managing orders, vehicles, customers, and workshop activity.",
        theme_color: "#0f1115",
        background_color: "#0f1115",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [createManifestIcon(192), createManifestIcon(512)],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallback: "index.html",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    clearMocks: true,
  },
});

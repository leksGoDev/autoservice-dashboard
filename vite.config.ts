import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { createPwaManifest, pwaWorkbox } from "./src/app/pwa/config";

const githubPagesBase = "/autoservice-dashboard/";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, new URL(".", import.meta.url).pathname, "");
  const shouldEnablePwa = env.VITE_ENABLE_PWA !== "false";

  return {
    base: githubPagesBase,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        injectRegister: null,
        disable: !shouldEnablePwa,
        registerType: "prompt",
        manifest: {
          ...createPwaManifest(githubPagesBase),
          icons: [...createPwaManifest(githubPagesBase).icons],
        },
        workbox: {
          ...pwaWorkbox,
          globPatterns: [...pwaWorkbox.globPatterns],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-query-table": ["@tanstack/react-query", "@tanstack/react-table"],
            "vendor-i18n": ["i18next", "react-i18next"],
            "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
            "vendor-charts": ["recharts"],
          },
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      globals: true,
      clearMocks: true,
    },
  };
});

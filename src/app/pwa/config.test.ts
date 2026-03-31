import { describe, expect, it } from "vitest";

import { createPwaManifest, pwaManifest, pwaWorkbox } from "./config";

describe("pwa manifest config", () => {
  it("uses installable metadata and standalone mode", () => {
    expect(pwaManifest.name).toBe("Autoservice Operations Dashboard");
    expect(pwaManifest.short_name).toBe("Autoservice Ops");
    expect(pwaManifest.display).toBe("standalone");
    expect(pwaManifest.start_url).toBe("/");
    expect(pwaManifest.scope).toBe("/");
  });

  it("defines required icon sizes", () => {
    const iconSizes = pwaManifest.icons.map((icon) => icon.sizes);
    expect(iconSizes).toContain("192x192");
    expect(iconSizes).toContain("512x512");
  });

  it("allows rebasing manifest paths for subpath deployments", () => {
    const manifest = createPwaManifest("/autoservice-dashboard/");

    expect(manifest.start_url).toBe("/autoservice-dashboard/");
    expect(manifest.scope).toBe("/autoservice-dashboard/");
    expect(manifest.icons[0]?.src).toBe("/autoservice-dashboard/pwa-icon-192.png");
    expect(manifest.icons[1]?.src).toBe("/autoservice-dashboard/pwa-icon-512.png");
  });
});

describe("pwa workbox config", () => {
  it("caches app shell and keeps navigation fallback", () => {
    expect(pwaWorkbox.navigateFallback).toBe("index.html");
    expect(pwaWorkbox.globPatterns).toContain("**/*.{js,css,html,ico,png,svg}");
  });
});

/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // Relative asset paths, so the build works under any sub-path (e.g. GitHub Pages /open-ux-lab/).
  base: "./",
  plugins: [
    react(),
    // Installable app + offline support. The service worker precaches the built app, so lessons work
    // offline; new versions wait until the learner chooses Update (see UpdatePrompt.tsx).
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      includeAssets: ["favicon.svg", "icons/favicon-32.png", "icons/apple-touch-icon.png"],
      manifest: {
        name: "Open UX Lab",
        short_name: "UX Lab",
        description: "Free UX practice: short lessons and pick-the-better-design exercises.",
        id: "./",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#eef1ec",
        theme_color: "#eef1ec",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        // The app only ever loads Latin font subsets, and the link-preview image is only for social apps.
        globIgnores: ["**/*cyrillic*", "**/*vietnamese*", "**/*greek*", "og-image.png"],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: "node",
    // Let content tests import styles.css?raw to check that mockup classes exist.
    css: { include: [/styles\.css/] },
  },
});

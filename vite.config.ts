/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset paths, so the build works under any sub-path (e.g. GitHub Pages /open-ux-lab/).
  base: "./",
  plugins: [react()],
  test: {
    environment: "node",
  },
});

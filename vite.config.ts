import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
  },
});

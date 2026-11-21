import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { msw } from "msw/vite";

export default defineConfig({
  plugins: [react(), msw()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

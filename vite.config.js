import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages base path (repo name)
const repoBase = "/gov-api-explorer/";

export default defineConfig({
  plugins: [react()],
  base: repoBase
});

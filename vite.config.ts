import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path, { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      outDir: "dist",
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  /*   css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }, */
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "UI KIT",
      formats: ["es", "umd"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "tailwindcss"],
    },
  },
});

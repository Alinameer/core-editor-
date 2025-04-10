import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      outDir: "dist",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "tailwindcss"],
      output: {
        dir: "dist",
        format: "es",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
        inlineDynamicImports: false,
      },
    },
  },
});

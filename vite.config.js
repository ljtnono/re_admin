import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@v": fileURLToPath(new URL("./src/view", import.meta.url)),
      "@c": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@a": fileURLToPath(new URL("./src/assets", import.meta.url))
    }
  },
  server: {
    host: "0.0.0.0",
    port: 8080
  }
});

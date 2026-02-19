import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    federation({
      name: "web_asset",
      filename: "remoteEntry.js",
      exposes: {
        "./HomePage": "./src/pages/HomePage.vue",
        "./DashboardPage": "./src/pages/DashboardPage.vue",
        "./ReportPage": "./src/pages/ReportPage.vue",
        "./AgentPage": "./src/pages/AgentPage.vue",
        "./TradePage": "./src/pages/TradePage.vue",
        "./LabPage": "./src/pages/LabPage.vue",
        "./HistoryPage": "./src/pages/HistoryPage.vue",
      },
      shared: ["vue", "pinia", "vue-router"],
    }),
  ],
  server: {
    host: "127.0.0.1",
    port: 5174,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 4174,
    strictPort: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});

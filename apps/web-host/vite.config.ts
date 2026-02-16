import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const remoteAssetUrl =
    env.VITE_WEB_ASSET_REMOTE_URL || "http://127.0.0.1:5174/assets/remoteEntry.js";

  return {
    plugins: [
      vue(),
      tailwindcss(),
      federation({
        name: "web_host",
        remotes: {
          web_asset: remoteAssetUrl,
        },
        shared: ["vue", "pinia", "vue-router"],
      }),
    ],
    server: {
      host: "127.0.0.1",
      port: 5173,
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
      port: 4173,
      strictPort: true,
    },
    build: {
      target: "esnext",
    },
  };
});

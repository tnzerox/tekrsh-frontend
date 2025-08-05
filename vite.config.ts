import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0', 
    port: 8080,
    hmr: {
      host: 'savorynepal.test',
      protocol: 'ws',
      // **This line is critical. It tells the browser to connect here for HMR.**
      path: '/hmr-ws', 
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

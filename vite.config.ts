import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { configDotenv } from "dotenv";
import { defineConfig } from "vite";
import path from "path";

configDotenv();

export default defineConfig({
  plugins: [react(), tailwindcss()],

  optimizeDeps: {
    exclude: ["lucide-react"],
  },

  define: {
    "process.env": process.env,
  },

  server: {
    port: 3000,
    host: true,
  },

  preview: {
    port: 3007,
    host: true,
  },

  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src/"),
    },
  },
});

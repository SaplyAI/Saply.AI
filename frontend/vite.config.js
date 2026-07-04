import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = "/Users/bhanukiran1535/Desktop/_/AI:ML/Saply.ai/frontend";
const workspaceRoot = "/Users/bhanukiran1535/Desktop/_/AI:ML/Saply.ai";

export default defineConfig({
  root: projectRoot,
  server: {
    host: "0.0.0.0",
    fs: {
      strict: false,
      allow: [projectRoot, workspaceRoot],
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
});
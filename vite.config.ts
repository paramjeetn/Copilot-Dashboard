import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import fs from "vite-plugin-fs";


export default defineConfig({
  plugins: [react(),fs()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

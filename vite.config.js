import { createLogger, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
  if (typeof msg === "string" && msg.includes("[PLUGIN_TIMINGS]")) return
  loggerWarn(msg, options)
}

export default defineConfig({
  plugins: [react()],
  customLogger: logger,
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("node_modules/@react-three")) return "react-three";
          if (id.includes("node_modules/gsap")) return "gsap";
          if (id.includes("node_modules/framer-motion")) return "framer-motion";
          if (id.includes("node_modules/@supabase")) return "supabase";
          if (id.includes("node_modules/lenis")) return "lenis";
        },
      },
    },
  },
})

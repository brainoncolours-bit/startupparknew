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
  },
})

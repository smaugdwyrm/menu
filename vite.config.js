import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',      // Expose to your LAN
    port: 5173,           // Default port
    strictPort: true,     // If 5173 is busy, don't fall back
    cors: true,           // Allow other devices to fetch resources
    open: false           // Don't auto-open browser
  }
})

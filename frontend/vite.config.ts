import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/frontend/",   // 👈 เพิ่มบรรทัดนี้
  plugins: [react()],

  test: {
    environment: "jsdom",
    globals: true,
  }
})

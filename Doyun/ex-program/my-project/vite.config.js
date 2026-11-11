import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ✅ 추가

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ 플러그인 등록
  ],
})
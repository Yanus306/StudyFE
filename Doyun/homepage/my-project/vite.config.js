import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. 임포트하기

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. 플러그인 추가하기
  ],
})
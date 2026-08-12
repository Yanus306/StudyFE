import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // v4 전용 플러그인

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 플러그인 추가
  ],
});
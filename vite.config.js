import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( ),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  base: './', // <-- 将这里改为相对路径 './'
  build: {
    outDir: 'dist', // <-- 确保输出目录是 'dist'
    assetsDir: 'assets', // <-- 确保静态资源目录是 'assets'
  }
})
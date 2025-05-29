/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, 
    strictPort: true, // 5173
  },
  test: {
    globals: true, // Чтобы использовать describe, it, expect и т.д. без импортов
    environment: 'jsdom', // Окружение для тестов
    setupFiles: './src/setupTests.ts', // Опциональный файл для глобальной настройки тестов
    css: true, // Установите в true или объект настроек, если CSS важен для ваших тестов
  },
})

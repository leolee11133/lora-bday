import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE is set when deploying to GitHub Pages (see `npm run deploy`).
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})

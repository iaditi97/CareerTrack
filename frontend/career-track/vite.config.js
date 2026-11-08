import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // Added to handle local folder structures

// https://vite.dev
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Forces your router and packages to read from the exact same React folder
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
})

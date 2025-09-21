import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    // proxy: {
    //   "/api": {
    //     // target: "http://localhost:3001", // Backend server
    //     target: "https://auth-toolkit-backend.onrender.com", // Production backend server
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  // 🔄 Build configuration for Netlify
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // 🔄 Ensure proper file extensions
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // 🔄 Generate source maps for debugging
    sourcemap: true,
    // 🔄 Ensure assets are properly handled
    assetsInlineLimit: 0
  },
  
  // 🔄 Base URL configuration
  base: '/',
  
  // 🔄 Preview configuration (for local testing of build)
  preview: {
    port: 4173,
    host: true
  },
  
  // 🔄 Environment variables
  define: {
    // Ensure env vars are properly defined
    // eslint-disable-next-line no-undef
    'process.env': process.env
  }
})

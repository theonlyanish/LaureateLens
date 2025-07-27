import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable minification for better performance
    minify: 'terser',
    // Generate source maps for debugging but keep bundle size optimal
    sourcemap: false,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        // Better chunk naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Manual chunks for better caching strategy
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          charts: ['recharts', 'react-simple-maps'],
          router: ['react-router-dom']
        }
      }
    },
    // Target modern browsers for better performance
    target: 'es2015',
    // Ensure CSS is extracted
    cssCodeSplit: true
  },
  // Enable server-side rendering preparation
  ssr: {
    // Externalize dependencies that don't need to be bundled for SSR
    noExternal: ['@mui/material', '@mui/icons-material']
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', 'recharts']
  }
})

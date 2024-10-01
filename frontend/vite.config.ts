import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        // Define which files should be precached
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,gltf}'],
        // Configure runtime caching strategy
        runtimeCaching: [
          {
            // Match all URLs
            urlPattern: ({ url }) => url.href,
            // Use Network First strategy
            handler: 'NetworkFirst',
            options: {
              // Name of the cache storage
              cacheName: 'api-cache',
              // Time to wait for network response before falling back to cache
              networkTimeoutSeconds: 10,
              // Define which responses are considered cacheable
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.png'],
      manifest: {
        name: 'TechTix by UP Mindanao SPARCS',
        short_name: 'TechTix',
        description: 'Tech Events by Davao. For Davao.',
        theme_color: '#0675C9',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
    // },
    // build: {
    //   rollupOptions: {
    //     output: {
    //       // for checking size of each module
    //       // manualChunks(id) {
    //       //   if (id.includes('node_modules')) {
    //       //     return id.toString().split('node_modules/')[1].split('/')[0].toString();
    //       //   }
    //       // }

    //       manualChunks(id) {
    //         if (id.includes('node_modules')) {
    //           if (id.includes('lucide-react')) {
    //             return 'vendor_lucide';
    //           }

    //           return 'vendor';
    //         }
    //       }
    //     }
    //   }
  }
});

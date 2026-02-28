import path from 'path';
import { defineConfig } from 'vite';
// import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      ViteImageOptimizer({
        svg: {
          plugins: [
          {
            name: 'removeMetadata',
          },
          {
            name: 'removeViewBox',
          },
          
        ]},
        png: {
            quality: 80
        },
        jpeg: {
            quality: 80
        },
        jpg: {
            quality: 80
        },

      })
      // VitePWA({
      //   registerType: 'autoUpdate', // Automatically update the service worker
      //   devOptions: {
      //     enabled: true
      //   },
      //   workbox: {
      //     // Define which files should be precached
      //     globPatterns: ['**/*.{js,css,html,ico,png,svg,json,gltf}'],
      //     // Configure runtime caching strategy
      //     runtimeCaching: [
      //       {
      //         // Match all URLs
      //         urlPattern: ({ url }) => url.href,
      //         // Use NetworkFirst strategy to ensure fresh data is served
      //         handler: 'NetworkFirst',
      //         options: {
      //           cacheName: 'api-cache',
      //           networkTimeoutSeconds: 10,
      //           cacheableResponse: {
      //             statuses: [0, 200]
      //           }
      //         }
      //       }
      //     ],
      //     skipWaiting: true, // Immediately activate the new service worker
      //     clientsClaim: true // Take control of the page as soon as the service worker activates
      //   },
      //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.png'],
      //   manifest: {
      //     name: 'TechTix by UP Mindanao SPARCS',
      //     short_name: 'TechTix',
      //     description: 'Tech Events by Davao. For Davao.',
      //     theme_color: '#0675C9',
      //     icons: [
      //       {
      //         src: 'icon-192x192.png',
      //         sizes: '192x192',
      //         type: 'image/png'
      //       },
      //       {
      //         src: 'icon-512x512.png',
      //         sizes: '512x512',
      //         type: 'image/png'
      //       }
      //     ]
      //   }
      // })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@amplify_outputs': mode === 'dummy' ? '/dummy_amplify_outputs.json' : '/amplify_outputs.json'
      }
    }
  };
});

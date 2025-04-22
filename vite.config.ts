import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from "path";
import type { Plugin } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Add PWA support for better performance and offline capabilities
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Createathon",
        short_name: "Createathon",
        description: "Level up your content creation journey",
        theme_color: "#ffffff",
        start_url: "/",
        icons: [
          {
            src: "/Logotype.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        sourcemap: true,
        runtimeCaching: [
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(js|css|json)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
    // Add bundle visualization for debugging bundle sizes
    visualizer({
      filename: "stats.html",
      open: false,
      gzipSize: true,
    }) as Plugin,
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize build settings
    target: "es2015",
    outDir: "dist",
    assetsDir: "assets",
    minify: "terser",
    cssMinify: true,
    terserOptions: {
      compress: {
        drop_console: true,
        dead_code: true,
      },
    },
    rollupOptions: {
      output: {
        // Chunk by category for better caching
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) return "vendor-framer-motion";
            if (id.includes("react-router")) return "vendor-react-router";
            if (id.includes("react-toastify")) return "vendor-react-toastify";
            if (id.includes("react")) return "vendor-react";
            return "vendor"; // all other vendor modules
          }
          if (id.includes("Components")) return "components";
          if (id.includes("utils")) return "utils";
        },
        // Customize chunk file naming
        entryFileNames: "assets/js/[name]-[hash].js",
        chunkFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css"))
            return "assets/css/[name]-[hash][extname]";
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name || ""))
            return "assets/images/[name]-[hash][extname]";
          if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name || ""))
            return "assets/fonts/[name]-[hash][extname]";
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  // Enable performance optimizations
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "framer-motion"],
  },
  // Configure server options
  server: {
    open: true,
    cors: true,
  },
  // Configure preview options
  preview: {
    port: 3000,
    open: true,
  },
});

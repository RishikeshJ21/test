import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Babel configuration for optimization
      babel: {
        plugins: [
          // Remove console logs in production
          ["transform-remove-console", { exclude: ["error", "warn"] }],
        ],
      },
    }),
    // Add PWA support for better UX and caching
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "Logotype.svg", "svg.svg"],
      manifest: {
        name: "Createathon",
        short_name: "Createathon",
        theme_color: "#4e1f88",
        icons: [
          {
            src: "/Logotype.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "/Logotype.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Cache all static assets
        globPatterns: [
          "**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}",
        ],
        // Cache images to reduce network requests
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2015",
    outDir: "dist",
    assetsDir: "assets",
    // Use terser for better minification with enhanced settings
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
        passes: 2,
        ecma: 2015,
        toplevel: true,
        unsafe_arrows: true,
        keep_infinity: true,
      },
      format: {
        comments: false,
        ecma: 2015,
      },
      mangle: {
        toplevel: true,
        safari10: true,
      },
    },
    // No sourcemaps in production for smaller files
    sourcemap: false,
    cssMinify: true,
    rollupOptions: {
      output: {
        // Improved chunking strategy for better code splitting
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("react-router")) {
              return "vendor-router";
            }
            if (id.includes("framer-motion")) {
              return "vendor-animations";
            }
            if (id.includes("lucide-react") || id.includes("react-icons")) {
              return "vendor-icons";
            }
            if (
              id.includes("tailwind") ||
              id.includes("class-variance-authority") ||
              id.includes("clsx")
            ) {
              return "vendor-styling";
            }
            return "vendor";
          }

          // Group by feature areas
          if (id.includes("/src/Components/")) {
            return "components";
          }
          if (id.includes("/src/SubComponents/")) {
            return "subcomponents";
          }
          if (id.includes("/src/pages/")) {
            return "pages";
          }
        },
        // More aggressive code splitting
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
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "lodash",
      // Include all major dependencies for pre-bundling
      "react-helmet-async",
      "react-lazy-load-image-component",
      "clsx",
      "tailwind-merge",
    ],
    esbuildOptions: {
      target: "es2015",
      treeShaking: true,
    },
  },
  server: {
    open: true,
    cors: true,
    // Enable build optimization during development
    hmr: {
      overlay: true,
    },
  },
  preview: {
    port: 3000,
    open: true,
  },
});

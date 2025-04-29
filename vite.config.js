import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        target: "es2015",
        outDir: "dist",
        assetsDir: "assets",
        minify: "esbuild",
        cssMinify: true,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("framer-motion"))
                            return "vendor-framer-motion";
                        if (id.includes("react-router"))
                            return "vendor-react-router";
                        if (id.includes("react-toastify"))
                            return "vendor-react-toastify";
                        if (id.includes("react"))
                            return "vendor-react";
                        if (id.includes("lodash"))
                            return "vendor-lodash";
                        return "vendor"; // all other vendor modules
                    }
                    if (id.includes("Components"))
                        return "components";
                    if (id.includes("utils"))
                        return "utils";
                },
                entryFileNames: "assets/js/[name]-[hash].js",
                chunkFileNames: "assets/js/[name]-[hash].js",
                assetFileNames: function (assetInfo) {
                    var _a;
                    if ((_a = assetInfo.name) === null || _a === void 0 ? void 0 : _a.endsWith(".css"))
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
    optimizeDeps: {
        include: ["react", "react-dom", "react-router-dom", "framer-motion", "lodash"],
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

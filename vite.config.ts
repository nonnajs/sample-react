import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import {nonna} from "@nonnajs/vite-plugin";

export default defineConfig({
    plugins: [
        react(),
        // @nonnajs/di's published dist bundle statically imports a handful of Node builtins
        // (async_hooks, fs/promises, path, url) that a real browser bundler can't resolve on its
        // own - this sample never exercises the Node-only features they back (no
        // runInScope()/request-scoped providers, no loadBeans() - it uses .scan() instead), so
        // browser-safe shims are all that's needed. See @nonnajs/vite-plugin's README for details.
        nonna(),
    ],
    server: {
        port: 5173,
    },
});

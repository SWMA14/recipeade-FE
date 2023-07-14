import adapter from "@sveltejs/adapter-cloudflare";
import path from "path";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import("@sveltejs/kit").Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            precompress: true
        }),
        alias: {
            "$components": path.resolve("./src/components"),
            "$assets": path.resolve("./src/assets"),
            "$lib": path.resolve("./src/lib")
        },
        prerender: {
            concurrency: 10
        }
    }
};

export default config;
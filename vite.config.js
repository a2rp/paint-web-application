import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/paint-web-application/",
    plugins: [react()],
    build: {
        sourcemap: false,
    },
});

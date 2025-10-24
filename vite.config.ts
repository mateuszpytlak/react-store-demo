import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {configDefaults} from "vitest/config";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/setupTests.ts",
        css: true,
        coverage: {
            reporter: ["text", "html"],
            exclude: [...configDefaults.coverage?.exclude ?? [], "src/main.tsx"]
        }
    }
});

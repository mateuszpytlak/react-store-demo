import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),       // 👈 obsługa JSX, TSX, Fast Refresh
        tailwindcss(), // 👈 stylowanie Tailwind v4 (Oxide)
    ],
});

import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        products: resolve(__dirname, "products.html"),
        markets: resolve(__dirname, "markets.html"),
        retail: resolve(__dirname, "retail.html"),
        faq: resolve(__dirname, "faq.html"),
        quote: resolve(__dirname, "quote.html"),
        process: resolve(__dirname, "process.html"),
        teamMicah: resolve(__dirname, "team-micah.html"),
        teamKaboyo: resolve(__dirname, "team-kaboyo.html"),
        teamMatthew: resolve(__dirname, "team-matthew.html"),
        teamNorah: resolve(__dirname, "team-norah.html"),
        teamOliver: resolve(__dirname, "team-oliver.html"),
      }
    }
  }
});

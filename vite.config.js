import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import vue from '@vitejs/plugin-vue'
//import AutoImport from 'unplugin-auto-import'
import i18nResources from "vite-plugin-i18n-resources";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    i18nResources({
      path: resolve(__dirname, "src/locales"),
    }),
    Inspect(),
//    AutoImport({ /* options */ })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

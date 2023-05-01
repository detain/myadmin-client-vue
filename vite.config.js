import { defineConfig } from 'vite'
import { splitVendorChunkPlugin } from 'vite'
//import Inspect from 'vite-plugin-inspect'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import i18nResources from "vite-plugin-i18n-resources"
import { resolve } from "path"
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.ELECTRON=="true" ? './' : "/",
  plugins: [
    vue(),
    //Inspect(),
    AutoImport({
      imports: ['vue', '@vueuse/core']  ,
      resolvers: [
      ],
      dirs: [
        './composables/**',
      ],
      vueTemplate: true,
      cache: true,
    }),
    splitVendorChunkPlugin(),
    i18nResources({
      path: resolve(__dirname, "src/locales"),
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

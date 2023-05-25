import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import { splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import Inspector from 'vite-plugin-vue-inspector'
//import Inspector from 'unplugin-vue-inspector/vite'
import AutoImport from 'unplugin-auto-import/vite'
import i18nResources from "vite-plugin-i18n-resources"
import { resolve } from "path"
import { fileURLToPath, URL } from 'node:url'
import inject from '@rollup/plugin-inject';
import { VitePWA } from 'vite-plugin-pwa'
//import { globalExternals } from '@fal-works/esbuild-plugin-global-externals'

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.ELECTRON=="true" ? './' : "/",
  plugins: [
    VueDevTools(),
    vue(),
    Inspect(),
    Inspector(),
    inject({
        jQuery: 'jquery',
    }),
    AutoImport({
      imports: ['vue', '@vueuse/core']  ,
      resolvers: [
      ],
      dirs: [
        './composables/'+'**',
        './views/'+'**'
      ],
      vueTemplate: true,
      cache: true,
    }),
    splitVendorChunkPlugin(),
    VitePWA({ registerType: 'autoUpdate' }),
    i18nResources({
      path: resolve(__dirname, "src/locales"),
    })
  ],
  optimizeDeps: {
      disabled: false,
      include: ["jquery"],
/*      esbuildOptions: {
        plugins: [globalExternals({ jquery: { type: "cjs", varName: "jQuery" } })]
      }*/
  },
  build: {
      commonjsOptions: { include: [] }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import { splitVendorChunkPlugin } from 'vite'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import Inspector from 'vite-plugin-vue-inspector'
//import Inspector from 'unplugin-vue-inspector/vite'
import AutoImport from 'unplugin-auto-import/vite'
//import i18nResources from "vite-plugin-i18n-resources"
import checker from 'vite-plugin-checker'
import { resolve } from "path"
import { fileURLToPath, URL } from 'node:url'
import inject from '@rollup/plugin-inject';
import { VitePWA } from 'vite-plugin-pwa'
//import legacy from '@vitejs/plugin-legacy'
//import { globalExternals } from '@fal-works/esbuild-plugin-global-externals'
import { dependencies } from './package.json';

function renderChunks(deps) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.ELECTRON=="true" ? './' : "/",
  plugins: [
    vue(),
    inject({
        jQuery: 'jquery',
    }),
    //i18nResources({
      //path: resolve(__dirname, "src/locales"),
    //}),
//    checker({
//	vueTsc: true,
//      typescript: true,
//    }), 
/*    AutoImport({
      imports: ['vue', '@vueuse/core']  ,
      resolvers: [
      ],
      dirs: [
        './composables/'+'**',
        './views/'+'**'
      ],
      vueTemplate: true,
      cache: true,
    }), */
    Inspect(),
    Inspector(),
    VueDevTools(),
/*
    chunkSplitPlugin({
      strategy: 'default', // 'single-vendor','all-in-one', 'unbundle', 'default'
      customChunk: (args)=>{
        // files into pages directory is export in single files
        let { file, id, moduleId, root } = args; */
		//file = file.replace(/^[\.\/]*/, '');
		//console.log('root:'+root+' file:'+file);
	//if (file.startsWith('src/views/billing/affiliates/Tos.vue')) {
		//return 'views-billing-affilites-tos';
	//} else 
/*	if (file.startsWith('src/views/billing/affiliates/')) {
		return 'views-billing-affilites';
        } else if(file.startsWith('src/')){
		return file.match('src/views/.*'+'/') ? 'views-'+file.split('/')[2] : (file.match('/.*'+'/') ? file.split('/')[1] : 'src');
	//file = file.substring(4);
          //file = file.replace(/\.[^.$]+$/, '');
         // return file;
        } else if (file.match('node_modules/datatables')) {
		return 'datatables';
	}
        return null;
      }, 
      customSplitting: {
        // `react` and `react-dom` will be bundled together in the `react-vendor` chunk (with their dependencies, such as object-assign)
        'datatables': ['datatables.net', 'datatables.net-dt', 'datatables.net-bs4'],
        // Any file that includes `utils` in src dir will be bundled in the `utils` chunk
        //'utils': [/src\/utils/]
      }
    }),
*/
    //splitVendorChunkPlugin(),
    //legacy({ targets: ['defaults', 'not IE 11'] })
    VitePWA({ 
	registerType: 'autoUpdate',
      //devOptions: {
        //enabled: true
      //}
    }),
  ],
  optimizeDeps: {
      disabled: false,
      include: ["jquery"],
/*      esbuildOptions: {
        plugins: [globalExternals({ jquery: { type: "cjs", varName: "jQuery" } })]
      }*/
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
	//manualChunks: (path) => path.split('/').reverse()[path.split('/').reverse().indexOf('node_modules') - 1] // just a hack to get the next path segment of the last node_modules in path Worked like a charm (works better as an function as it seems)
/*        manualChunks: (path) => {
	//console.log(path);
          if (path.includes('datatables.net')) {
		return 'vendor-datatables';
	}
          if (path.includes('jquery')) {
		return 'vendor-jquery';
	}
          if (path.includes('vue')) {
		return 'vendor-vue';
	}
          if (path.includes('node_modules')) {
		return 'vendor';
	}
	return "index";
*/
        manualChunks: {
          datatables: ['datatables.net-bs', 'datatables.net-bs4', 'datatables.net-buttons', 'datatables.net-buttons-bs', 'datatables.net-buttons-bs4', 'datatables.net-dt', 'datatables.net-responsive-bs', 'datatables.net-responsive-bs4', 'datatables.net-searchpanes-bs', 'datatables.net-select', 'datatables.net-select-bs', 'datatables.net-select-bs4', 'datatables.net-vue3', ],
	jquery: ['jquery', 'jquery-simple-pass-meter', 'jquery-sortable', 'jquery-ui', 
		//'jquery-ui-dist', 
	],
//	vite: ['vite', '@vitejs/plugin-legacy', '@vitejs/plugin-vue', 'vite-plugin-checker', 'vite-plugin-chunk-split','vite-plugin-inspect', 'vite-plugin-pwa', 'vite-plugin-vue-devtools', 'vite-plugin-vue-inspector' ],
//	vue: ['@fortawesome/vue-fontawesome', 'mosha-vue-toastify', '@unhead/vue', 'vue', 'vue-query', 'vue-recaptcha', 'vue-router',  '@vueuse/core', ],
	bootstrap: ['admin-lte', 'bootstrap', 'select2', 'sweetalert2', '@sweetalert2/theme-bootstrap-4', 'tempusdominus-bootstrap-4', ],
//          ...renderChunks(dependencies),
        },
      },
    },
      commonjsOptions: {
	include: []
      }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

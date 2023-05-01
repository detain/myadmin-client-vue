# myadmin-static-client

This template should help get you started developing with Vue 3 in Vite.

## Development

### Setting up your dev environment

* [Vue Devtools](https://devtools.vuejs.org/guide/installation.html)  Install this in your browser(s).  When you open up the Inspection//Console there wil be a Vue button that shows up if you are on a Vue backed site.   You can use this to examine and go through all the data and stuff.



### To-Do / Road-Map

* [ ] loading / no entries messages
* [x] cache data in pinia stores
* [ ] fix all linter issues
* [x] view service pages
  * [x] load data via ajax api
  * [ ] links and form handling
* [x] order service pages
  * [x] layout / design implemented
  * [ ] form and api submission handling
* [x] services list pages
  * [x] ajax loading via api calls
  * [x] convert links to router-links
  * [x] datatables or equivalent
    * [x] filtering
    * [ ] sorting
    * [ ] pagination
  * [ ] print/export
* [ ] api finalized
* [ ] check out vue-query t see if we should be using it
* [ ] check out vue-use t see if we should be using it
* [ ] utilize the form validation stuff
* [ ] incorporate typescript
* [x] electron build
  * [x] windows/linux/mac builds
  * [ ] js/css assets loaded locally
* [x] login / authentication handling
* [x] CORS
* [x] modern routes


| Link| Modern Route | Vue Template Setup | Backend API Setup | API Data Loading | Form Submission Handling | API Calls Condensed | Utilize Pinia State |
| ---- | ---- | ------------------ | ----------------- | ---------------- | ------------------------ | ------------------- | ------------------- |
| view_domains_list | domains | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_domain | domains/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_domain | domains/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_backups_list | backups | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_backup | backups/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_backup | backups/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_websites_list | websites | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_website | websites/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_website | websites/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_vps_list | vps | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_vps | vps/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_vps | vps/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_qs_list | qs | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_qs | qs/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_qs | qs/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_ssl_list | ssl | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_ssl | ssl/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_ssl | ssl/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_servers_list | servers | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_server | servers/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_server | servers/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_licenses_list | licenses | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_license | licenses/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_license | licenses/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_mail_list | mail | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_mail | mail/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_mail | mail/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
|  |  |  |  |  |  |  |  |


### Links

* [alex8088/electron-vite: Next generation Electron build tooling based on Vite 新一代 Electron 开发构建工具，支持源代码保护](https://github.com/alex8088/electron-vite)
* [alex8088/vite-plugin-electron-config: Electron plugin for Vite](https://github.com/alex8088/vite-plugin-electron-config)
* [antfu/unplugin-auto-import: Auto import APIs on-demand for Vite, Webpack and Rollup](https://github.com/antfu/unplugin-auto-import)
* [antfu/unplugin-vue-components: 📲 On-demand components auto importing for Vue](https://github.com/antfu/unplugin-vue-components)
* [antfu/vite-plugin-inspect: Inspect the intermediate state of Vite plugins](https://github.com/antfu/vite-plugin-inspect)
* [ArcherGu/fast-vite-electron: Vite + Electron with esbuild, so fast! ⚡](https://github.com/ArcherGu/fast-vite-electron)
* [ArcherGu/fast-vite-nestjs-electron: Vite + Electron + Nestjs with esbuild, crazy fast! ⚡](https://github.com/ArcherGu/fast-vite-nestjs-electron)
* [Awesome Vite (vitejs/awesome-vite) Overview - Track Awesome List](https://www.trackawesomelist.com/vitejs/awesome-vite/readme/)
* [BroJenuel/vue-3-vite-electron-typescript: This is a template to be used when developing an electron](https://github.com/BroJenuel/vue-3-vite-electron-typescript)
* [bundle-tools/packages/unplugin-vue-i18n at main · intlify/bundle-tools · GitHub](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n)
* [caoxiemeihao/electron-forge-vite: For test "electron-forge" Vite template.](https://github.com/caoxiemeihao/electron-forge-vite)
* [caoxiemeihao/vite-electron-plugin: High-performance, esbuild-based Vite Electron plugin](https://github.com/caoxiemeihao/vite-electron-plugin)
* [cawa-93/vite-electron-builder: Secure boilerplate for Electron app based on Vite. TypeScript + Vue/React/Angular/Svelte/Vanilla](https://github.com/cawa-93/vite-electron-builder)
* [chenxch/vite-plugin-dynamic-base: Resolve all resource files dynamic publicpath, like Webpack's __webpack_public_path__](https://github.com/chenxch/vite-plugin-dynamic-base)
* [Common Configuration - electron-builder](https://www.electron.build/configuration/configuration.html)
* [Configuring Vite | Vite](https://v2.vitejs.dev/config/#resolve-alias)
* [crcong/vite-plugin-externals: use to external resources](https://github.com/crcong/vite-plugin-externals)
* [cssninjaStudio/unplugin-fonts: Universal Webfont loader - Unfonts - based on https://web.dev/optimize-webfont-loading/](https://github.com/cssninjaStudio/unplugin-fonts)
* [Deluze/electron-vue-template: Simple Vue3 + Electron starter template in TypeScript, including ViteJS and Electron Builder](https://github.com/Deluze/electron-vue-template)
* [Dunqing/vite-plugin-dynamic-import-module: A vite plugin to support variables in dynamic imports module in Vite](https://github.com/Dunqing/vite-plugin-dynamic-import-module)
* [ebeloded/vite-plugin-redirect](https://github.com/ebeloded/vite-plugin-redirect)
* [electron-builder](https://www.electron.build/)
* [electron-vite/create-electron-vite: Scaffolding Your Electron + Vite Project](https://github.com/electron-vite/create-electron-vite)
* [electron-vite/electron-vite-boilerplate: 📚 Really simple Electron + Vite boilerplate.](https://github.com/electron-vite/electron-vite-boilerplate)
* [electron-vite/electron-vite-vue: 🥳 Really simple Electron + Vite + Vue boilerplate.](https://github.com/electron-vite/electron-vite-vue)
* [electron-vite/vite-plugin-electron: 🔗 ⚡️](https://github.com/electron-vite/vite-plugin-electron)
* [electron-vite/vite-plugin-electron-renderer: Support use Node.js API in Electron-Renderer](https://github.com/electron-vite/vite-plugin-electron-renderer)
* [erdkse/adminlte-3-vue: Vue 3.2.39 start-up project with AdminLTE 3.2.0 template](https://github.com/erdkse/adminlte-3-vue)
* [Examples | Awesome Vue.js](https://awesome-vue.js.org/resources/examples.html)
* [feat-agency/vite-plugin-webfont-dl: ⚡ Webfont Download Vite Plugin - Make your Vite site load faster](https://github.com/feat-agency/vite-plugin-webfont-dl)
* [fi3ework/vite-plugin-checker: 💬 Vite plugin that provide checks of TypeScript, ESLint, vue-tsc, Stylelint and more.](https://github.com/fi3ework/vite-plugin-checker)
* [Functions | VueUse](https://vueuse.org/functions.html)
* [Geocld/vite-plugin-importus: Modularly import plugin, compatible with antd, lodash, material-ui and so on.](https://github.com/Geocld/vite-plugin-importus)
* [Getting Started - Electron Forge](https://www.electronforge.io/)
* [Getting Started | Vite](https://vitejs.dev/guide/)
* [hydrati/vitectron: Powerful Vue Desktop Application Template](https://github.com/hydrati/vitectron)
* [jooy2/vutron: 💚 Quick Start Templates for Vite + Electron + Vue 3 + Vuetify + TypeScript. Vutron is a preconfigured template for developing Electron cross-platform desktop apps. It uses Vue 3 and allows you to build a fast development environment with little effort.](https://github.com/jooy2/vutron)
* [kefranabg/awesome-vue-composition-api: 🚀 A curated list of awesome things related to vue composition api](https://github.com/kefranabg/awesome-vue-composition-api)
* [KesionX/vite-plugin-head: Modify, add, delete Metadata in the head element.](https://github.com/KesionX/vite-plugin-head)
* [kirklin/unplugin-config: 🔧 Configuration file generator for web apps, allowing external customization of global variables without repackaging.](https://github.com/kirklin/unplugin-config)
* [Next Generation Electron Build Tooling | electron-vite](https://evite.netlify.app/)
* [onebay/vite-plugin-imp: A vite plugin for import library component style automatic.](https://github.com/onebay/vite-plugin-imp)
* [Plugin API | Vite](https://vitejs.dev/guide/api-plugin.html)
* [sanyuan0704/vite-plugin-chunk-split: A vite plugin for better chunk splitting. 一个简单易用的 Vite 拆包插件](https://github.com/sanyuan0704/vite-plugin-chunk-split)
* [Scaffold | Awesome Vue.js](https://awesome-vue.js.org/components-and-libraries/scaffold.html)
* [sindresorhus/awesome-electron: Useful resources for creating apps with Electron](https://github.com/sindresorhus/awesome-electron)
* [starter-vue3-adminlte3/package.json at main · carlospccarvalho/starter-vue3-adminlte3 · GitHub](https://github.com/carlospccarvalho/starter-vue3-adminlte3/blob/main/package.json)
* [tada5hi/vitron: This is a library to build beautiful (win, linux, mac) desktop apps for modern web projects with vite and electron.](https://github.com/tada5hi/vitron)
* [umbrella22/electron-vite-template: This project is a vue3 + Vite + electron project template composed of Vite and rollup. It has the same functions as my previous electron+Vue+template project](https://github.com/umbrella22/electron-vite-template)
* [unimorphic / vite-plugin-linter — Bitbucket](https://bitbucket.org/unimorphic/vite-plugin-linter/src/master/)
* [VeeValidate: Painless Vue.js forms](https://vee-validate.logaretm.com/v4)
* [vitejs/awesome-vite: ⚡️ A curated list of awesome things related to Vite.js](https://github.com/vitejs/awesome-vite)
* [Vite Plugin - Electron Forge](https://www.electronforge.io/config/plugins/vite)
* [vite-plugins/packages/vite-plugin-external at main · fengxinming/vite-plugins · GitHub](https://github.com/fengxinming/vite-plugins/tree/main/packages/vite-plugin-external)
* [vite-plugin/vite-plugin-dynamic-import: Enhance Vite builtin dynamic import](https://github.com/vite-plugin/vite-plugin-dynamic-import)
* [vite-plugin/vite-plugin-optimizer: Manually Pre-Bundling of Vite](https://github.com/vite-plugin/vite-plugin-optimizer)
* [vite-plugin/vite-plugin-resolve: Custom resolve module content](https://github.com/vite-plugin/vite-plugin-resolve)
* [vite-plugin/vite-plugin-target: Make Vite support Electron, Node.js, etc.](https://github.com/vite-plugin/vite-plugin-target)
* [Vue 3 + Vite + TypeScript + ELECTRON (My Full Setup) - DEV Community](https://dev.to/brojenuel/vue-3-vite-typescript-electron-my-full-setup-kgm)
* [Vue-cli3+adminlte quickly builds a background management template..._adminlte vue_Chasing ぢ's Blog-CSDN Blog](https://blog.csdn.net/weixin_43330752/article/details/88073837)
* [vue-composable](https://pikax.me/vue-composable/#introduction)
* [vuejs/awesome-vue: 🎉 A curated list of awesome things related to Vue.js](https://github.com/vuejs/awesome-vue)
* [vuesomedev/awesome-vue-3: A curated list of awesome things related to Vue 3](https://github.com/vuesomedev/awesome-vue-3)
* [wangzongming/vite-plugin-require: vite projects to support require](https://github.com/wangzongming/vite-plugin-require)
* [WarrenJones/vite-plugin-require-transform: A plugin for vite that convert from require syntax to import](https://github.com/WarrenJones/vite-plugin-require-transform)
* [XiSenao/vite-plugin-externals-extension: External links plugin which supports ESM and UMD for vite.](https://github.com/XiSenao/vite-plugin-externals-extension)
* [yingpengsha/vite-plugin-tips: 🏷 Provide better development server status tips on the page.](https://github.com/yingpengsha/vite-plugin-tips)
* [yracnet/vite-plugin-api: Create API routes from path directory like to Nextjs](https://github.com/yracnet/vite-plugin-api)
* [z-ti/vite-plugin-clean: A vite plugin to remove/clean your build folder(s).](https://github.com/z-ti/vite-plugin-clean)


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


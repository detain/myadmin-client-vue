# myadmin-static-client

This template should help get you started developing with Vue 3 in Vite.

## Development

### Setting up your dev environment

* [Vue Devtools](https://devtools.vuejs.org/guide/installation.html)  Install this in your browser(s).  When you open up the Inspection//Console there wil be a Vue button that shows up if you are on a Vue backed site.   You can use this to examine and go through all the data and stuff.

### Notes

* The site is essentially loaded in a single page and uses js to navigate without actual reloading
* 'stores' are sets of data and functions that can be carried over between pages, the best example is using it to to store sessionid so its known throughout the site
* most variables are handled by ref(erence) which are basically pointers.  in the JS code the data itself is accesed via .value  ie variable.value

### HTTP Methods to use when building out API

| HTTP Verb | CRUD | Entire Collection (e.g. /vps) | Specific Item (e.g. /vps/{id}) |
| --- | --- | --- | --- |
| POST | Create | 201 (Created), 'Location' header with link to /customers/{id} containing new ID. | 404 (Not Found), 409 (Conflict) if resource already exists.. |
| GET | Read | 200 (OK), list of customers. Use pagination, sorting and filtering to navigate big lists. | 200 (OK), single customer. 404 (Not Found), if ID not found or invalid. |
| PUT | Update/Replace | 405 (Method Not Allowed), unless you want to update/replace every resource in the entire collection. | 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid. |
| PATCH | Update/Modify | 405 (Method Not Allowed), unless you want to modify the collection itself. | 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid. |
| DELETE | Delete | 405 (Method Not Allowed), unless you want to delete the whole collection---not often desirable. | 200 (OK). 404 (Not Found), if ID not found or invalid. |

### To-Do / Road-Map

* [ ] loading / no entries messages
* [x] cache data in pinia stores
* [x] fix all linter issues
* [x] view service pages
  * [x] load data via ajax api
  * [ ] links and form handling
* [x] order service pages
  * [x] layout / design implemented
  * [x] route added
  * [x] template converted
  * [x] validate order ajax handling function
  * [x] error response handling
  * [ ] coupon handling
  * [ ] form validation
  * [x] summary display/price updating
  * [ ] forwarding to cart page
  * [ ] place order ajax handling function
* [x] services list pages
  * [x] ajax loading via api calls
  * [x] convert links to router-links
  * [x] datatables or equivalent
    * [x] filtering
    * [ ] sorting
    * [ ] pagination
  * [ ] print/export
* [ ] minimize api fields in requests/responses and filter them for security
* [ ] api finalized
* [ ] check out vue-query t see if we should be using it
* [ ] check out vue-use t see if we should be using it
* [ ] utilize the form validation stuff
* [ ] incorporate typescript
* [ ] replace jquery type calls with built in template handling and such
* [x] electron build
  * [x] windows/linux/mac builds
  * [ ] js/css assets loaded locally
* [x] login / authentication handling
* [x] CORS
* [x] modern routes

### Links

#### Electron Links

* [alex8088/electron-vite: Next generation Electron build tooling based on Vite 新一代 Electron 开发构建工具，支持源代码保护](https://github.com/alex8088/electron-vite)
* [alex8088/vite-plugin-electron-config: Electron plugin for Vite](https://github.com/alex8088/vite-plugin-electron-config)
* [ArcherGu/fast-vite-electron: Vite + Electron with esbuild, so fast! ⚡](https://github.com/ArcherGu/fast-vite-electron)
* [ArcherGu/fast-vite-nestjs-electron: Vite + Electron + Nestjs with esbuild, crazy fast! ⚡](https://github.com/ArcherGu/fast-vite-nestjs-electron)
* [BroJenuel/vue-3-vite-electron-typescript: This is a template to be used when developing an electron](https://github.com/BroJenuel/vue-3-vite-electron-typescript)
* [caoxiemeihao/electron-forge-vite: For test "electron-forge" Vite template.](https://github.com/caoxiemeihao/electron-forge-vite)
* [caoxiemeihao/vite-electron-plugin: High-performance, esbuild-based Vite Electron plugin](https://github.com/caoxiemeihao/vite-electron-plugin)
* [cawa-93/vite-electron-builder: Secure boilerplate for Electron app based on Vite. TypeScript + Vue/React/Angular/Svelte/Vanilla](https://github.com/cawa-93/vite-electron-builder)
* [Common Configuration - electron-builder](https://www.electron.build/configuration/configuration.html)
* [Deluze/electron-vue-template: Simple Vue3 + Electron starter template in TypeScript, including ViteJS and Electron Builder](https://github.com/Deluze/electron-vue-template)
* [electron-builder](https://www.electron.build/)
* [electron-vite/create-electron-vite: Scaffolding Your Electron + Vite Project](https://github.com/electron-vite/create-electron-vite)
* [electron-vite/electron-vite-boilerplate: 📚 Really simple Electron + Vite boilerplate.](https://github.com/electron-vite/electron-vite-boilerplate)
* [electron-vite/electron-vite-vue: 🥳 Really simple Electron + Vite + Vue boilerplate.](https://github.com/electron-vite/electron-vite-vue)
* [electron-vite/vite-plugin-electron: 🔗 ⚡️](https://github.com/electron-vite/vite-plugin-electron)
* [electron-vite/vite-plugin-electron-renderer: Support use Node.js API in Electron-Renderer](https://github.com/electron-vite/vite-plugin-electron-renderer)
* [Getting Started - Electron Forge](https://www.electronforge.io/)
* [hydrati/vitectron: Powerful Vue Desktop Application Template](https://github.com/hydrati/vitectron)
* [jooy2/vutron: 💚 Quick Start Templates for Vite + Electron + Vue 3 + Vuetify + TypeScript. Vutron is a preconfigured template for developing Electron cross-platform desktop apps. It uses Vue 3 and allows you to build a fast development environment with little effort.](https://github.com/jooy2/vutron)
* [Next Generation Electron Build Tooling | electron-vite](https://evite.netlify.app/)
* [sindresorhus/awesome-electron: Useful resources for creating apps with Electron](https://github.com/sindresorhus/awesome-electron)
* [tada5hi/vitron: This is a library to build beautiful (win, linux, mac) desktop apps for modern web projects with vite and electron.](https://github.com/tada5hi/vitron)
* [umbrella22/electron-vite-template: This project is a vue3 + Vite + electron project template composed of Vite and rollup. It has the same functions as my previous electron+Vue+template project](https://github.com/umbrella22/electron-vite-template)
* [Vite Plugin - Electron Forge](https://www.electronforge.io/config/plugins/vite)
* [Vue 3 + Vite + TypeScript + ELECTRON (My Full Setup) - DEV Community](https://dev.to/brojenuel/vue-3-vite-typescript-electron-my-full-setup-kgm)

#### Vue Links

* [AlbanCrepel/compiiile: The most convenient way to render a folder containing markdown files. Previewing and searching markdown files has never been that easy.](https://github.com/AlbanCrepel/compiiile)
* [antfu/unplugin-auto-import: Auto import APIs on-demand for Vite, Webpack and Rollup](https://github.com/antfu/unplugin-auto-import)
* [antfu/unplugin-vue-components: 📲 On-demand components auto importing for Vue](https://github.com/antfu/unplugin-vue-components)
* [antfu/vueuse: Collection of essential Vue Composition Utilities for Vue 2 and 3](https://github.com/antfu/vueuse)
* [bundle-tools/packages/unplugin-vue-i18n at main · intlify/bundle-tools · GitHub](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n)
* [carlospccarvalho/starter-vue3-adminlte3: AdminLTE 3 theme integration with Vue 3](https://github.com/carlospccarvalho/starter-vue3-adminlte3)
* [cssninjaStudio/unplugin-fonts: Universal Webfont loader - Unfonts - based on https://web.dev/optimize-webfont-loading/](https://github.com/cssninjaStudio/unplugin-fonts)
* [erdkse/adminlte-3-vue: Vue 3.2.39 start-up project with AdminLTE 3.2.0 template](https://github.com/erdkse/adminlte-3-vue)
* [Examples | Awesome Vue.js](https://awesome-vue.js.org/resources/examples.html)
* [Functions | VueUse](https://vueuse.org/functions.html)
* [intlify/bundle-tools: bundling for intlify i18n tools](https://github.com/intlify/bundle-tools/tree/main)
* [jfet97/vue-use-infinite-scroll: A Vue composition function that makes infinite scroll a breeze.](https://github.com/jfet97/vue-use-infinite-scroll)
* [jfet97/vue-use-switch-map: A Vue composition that let you compose a ref with a function from values to refs.](https://github.com/jfet97/vue-use-switch-map)
* [jsbroks/vuehooks: Extensive collection of composition functions for Vue](https://github.com/jsbroks/vuehooks)
* [kefranabg/awesome-vue-composition-api: 🚀 A curated list of awesome things related to vue composition api](https://github.com/kefranabg/awesome-vue-composition-api)
* [kirklin/unplugin-config: 🔧 Configuration file generator for web apps, allowing external customization of global variables without repackaging.](https://github.com/kirklin/unplugin-config)
* [LinusBorg/composition-api-demos: A Vue.js app demonstarting various use cases for the new composition API](https://github.com/LinusBorg/composition-api-demos)
* [logaretm/vue-use-form: ✅ A Vue.js composition API function to validate forms](https://github.com/logaretm/vue-use-form)
* [microcipcip/vue-use-kit: 🛠️Useful collection of Vue composition API functions https://microcipcip.github.io/vue-use-kit/](https://github.com/microcipcip/vue-use-kit)
* [mutoe/vue3-realworld-example-app: Explore the charm of Vue composition API! Vite?](https://github.com/mutoe/vue3-realworld-example-app)
* [openfext/vue-use: Use Vue Composition API Right Now (WIP)](https://github.com/openfext/vue-use)
* [pd4d10/npmview: A web application to view npm package files](https://github.com/pd4d10/npmview)
* [pikax/vue-composable: Vue composition-api composable components. i18n, validation, pagination, fetch, etc. +50 different composables](https://github.com/pikax/vue-composable)
* [posva/vue-compose-promise: 💝 Promises using vue composition api](https://github.com/posva/vue-compose-promise)
* [Scaffold | Awesome Vue.js](https://awesome-vue.js.org/components-and-libraries/scaffold.html)
* [starter-vue3-adminlte3/package.json at main · carlospccarvalho/starter-vue3-adminlte3 · GitHub](https://github.com/carlospccarvalho/starter-vue3-adminlte3/blob/main/package.json)
* [Tarektouati/vue-use-web: 🕸 Web APIs implemented as Vue.js composition functions](https://github.com/Tarektouati/vue-use-web)
* [VeeValidate: Painless Vue.js forms](https://vee-validate.logaretm.com/v4)
* [Vue-cli3+adminlte quickly builds a background management template..._adminlte vue_Chasing ぢ's Blog-CSDN Blog](https://blog.csdn.net/weixin_43330752/article/details/88073837)
* [vue-composable](https://pikax.me/vue-composable/#introduction)
* [vue-composable](https://pikax.me/vue-composable/#state)
* [vuejs/awesome-vue: 🎉 A curated list of awesome things related to Vue.js](https://github.com/vuejs/awesome-vue)
* [vuesomedev/awesome-vue-3: A curated list of awesome things related to Vue 3](https://github.com/vuesomedev/awesome-vue-3)

#### Vite Links

* [antfu/vite-plugin-inspect: Inspect the intermediate state of Vite plugins](https://github.com/antfu/vite-plugin-inspect)
* [Awesome Vite (vitejs/awesome-vite) Overview - Track Awesome List](https://www.trackawesomelist.com/vitejs/awesome-vite/readme/)
* [bundle-tools/CHANGELOG.md at main · intlify/bundle-tools · GitHub](https://github.com/intlify/bundle-tools/blob/main/packages/vite-plugin-vue-i18n/CHANGELOG.md)
* [chenxch/vite-plugin-dynamic-base: Resolve all resource files dynamic publicpath, like Webpack's __webpack_public_path__](https://github.com/chenxch/vite-plugin-dynamic-base)
* [Configuring Vite | Vite](https://v2.vitejs.dev/config/#resolve-alias)
* [crcong/vite-plugin-externals: use to external resources](https://github.com/crcong/vite-plugin-externals)
* [Dunqing/vite-plugin-dynamic-import-module: A vite plugin to support variables in dynamic imports module in Vite](https://github.com/Dunqing/vite-plugin-dynamic-import-module)
* [ebeloded/vite-plugin-redirect](https://github.com/ebeloded/vite-plugin-redirect)
* [feat-agency/vite-plugin-webfont-dl: ⚡ Webfont Download Vite Plugin - Make your Vite site load faster](https://github.com/feat-agency/vite-plugin-webfont-dl)
* [fi3ework/vite-plugin-checker: 💬 Vite plugin that provide checks of TypeScript, ESLint, vue-tsc, Stylelint and more.](https://github.com/fi3ework/vite-plugin-checker)
* [Geocld/vite-plugin-importus: Modularly import plugin, compatible with antd, lodash, material-ui and so on.](https://github.com/Geocld/vite-plugin-importus)
* [Getting Started | Vite](https://vitejs.dev/guide/)
* [IndexXuan/vue-cli-plugin-vite: Use vite today, with vue-cli.](https://github.com/IndexXuan/vue-cli-plugin-vite)
* [KesionX/vite-plugin-head: Modify, add, delete Metadata in the head element.](https://github.com/KesionX/vite-plugin-head)
* [onebay/vite-plugin-imp: A vite plugin for import library component style automatic.](https://github.com/onebay/vite-plugin-imp)
* [Plugin API | Vite](https://vitejs.dev/guide/api-plugin.html)
* [sanyuan0704/vite-plugin-chunk-split: A vite plugin for better chunk splitting. 一个简单易用的 Vite 拆包插件](https://github.com/sanyuan0704/vite-plugin-chunk-split)
* [unimorphic / vite-plugin-linter — Bitbucket](https://bitbucket.org/unimorphic/vite-plugin-linter/src/master/)
* [vitejs/awesome-vite: ⚡️ A curated list of awesome things related to Vite.js](https://github.com/vitejs/awesome-vite)
* [vite-plugins/packages/vite-plugin-external at main · fengxinming/vite-plugins · GitHub](https://github.com/fengxinming/vite-plugins/tree/main/packages/vite-plugin-external)
* [vite-plugin/vite-plugin-dynamic-import: Enhance Vite builtin dynamic import](https://github.com/vite-plugin/vite-plugin-dynamic-import)
* [vite-plugin/vite-plugin-optimizer: Manually Pre-Bundling of Vite](https://github.com/vite-plugin/vite-plugin-optimizer)
* [vite-plugin/vite-plugin-resolve: Custom resolve module content](https://github.com/vite-plugin/vite-plugin-resolve)
* [vite-plugin/vite-plugin-target: Make Vite support Electron, Node.js, etc.](https://github.com/vite-plugin/vite-plugin-target)
* [vite-pwa/vite-plugin-pwa: Zero-config PWA for Vite](https://github.com/vite-pwa/vite-plugin-pwa)
* [vuejs/vitepress: Vite & Vue powered static site generator.](https://github.com/vuejs/vitepress)
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


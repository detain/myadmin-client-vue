# myadmin-static-client

This template should help get you started developing with Vue 3 in Vite.

## To-Do / Road-Map

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
| order_domain| domains/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_backups_list | backups | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_backup | backups/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_backup| backups/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_websites_list | websites | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_website | websites/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_website| websites/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_vpss_list | vpss | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_vps | vpss/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_vps| vpss/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_qs_list | qs | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_qs | qs/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_qs | qs/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_ssl_list | ssl | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_ssl | ssl/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_ss l| ssl/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_servers_list | servers | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_server | servers/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_server| servers/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_licenses_list | licenses | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_license | licenses/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_license| licenses/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_mail_list | mail | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
| view_mail | mail/id | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
| order_mail| mail/order | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |
|  |  |  |  |  |  |  |  |


## Links

* [Awesome Vite (vitejs/awesome-vite) Overview - Track Awesome List](https://www.trackawesomelist.com/vitejs/awesome-vite/readme/)
* [Scaffold | Awesome Vue.js](https://awesome-vue.js.org/components-and-libraries/scaffold.html)
* [Configuring Vite | Vite](https://v2.vitejs.dev/config/#resolve-alias)
* [Common Configuration - electron-builder](https://www.electron.build/configuration/configuration.html)
* [Vue 3 + Vite + TypeScript + ELECTRON (My Full Setup) - DEV Community](https://dev.to/brojenuel/vue-3-vite-typescript-electron-my-full-setup-kgm)

* [vuejs/awesome-vue: 🎉 A curated list of awesome things related to Vue.js](https://github.com/vuejs/awesome-vue)
* [Vue-cli3+adminlte quickly builds a background management template..._adminlte vue_Chasing ぢ's Blog-CSDN Blog](https://blog.csdn.net/weixin_43330752/article/details/88073837)
* [Vue 3 + Vite + TypeScript + ELECTRON (My Full Setup) - DEV Community](https://dev.to/brojenuel/vue-3-vite-typescript-electron-my-full-setup-kgm)
* [Examples | Awesome Vue.js](https://awesome-vue.js.org/resources/examples.html)
* [sindresorhus/awesome-electron: Useful resources for creating apps with Electron](https://github.com/sindresorhus/awesome-electron)
* [Next Generation Electron Build Tooling | electron-vite](https://evite.netlify.app/)
* [Vite Plugin - Electron Forge](https://www.electronforge.io/config/plugins/vite)
* [vitejs/awesome-vite: ⚡️ A curated list of awesome things related to Vite.js](https://github.com/vitejs/awesome-vite)

* [caoxiemeihao/electron-forge-vite: For test "electron-forge" Vite template.](https://github.com/caoxiemeihao/electron-forge-vite)
* [electron-vite/vite-plugin-electron-renderer: Support use Node.js API in Electron-Renderer](https://github.com/electron-vite/vite-plugin-electron-renderer/)
* [electron-vite/electron-vite-vue: 🥳 Really simple Electron + Vite + Vue boilerplate.](https://github.com/electron-vite/electron-vite-vue)
* [cawa-93/vite-electron-builder: Secure boilerplate for Electron app based on Vite. TypeScript + Vue/React/Angular/Svelte/Vanilla](https://github.com/cawa-93/vite-electron-builder)
* [umbrella22/electron-vite-template: This project is a vue3 + Vite + electron project template composed of Vite and rollup. It has the same functions as my previous electron+Vue+template project](https://github.com/umbrella22/electron-vite-template)
* [ArcherGu/fast-vite-electron: Vite + Electron with esbuild, so fast! ⚡](https://github.com/ArcherGu/fast-vite-electron)
* [ArcherGu/fast-vite-nestjs-electron: Vite + Electron + Nestjs with esbuild, crazy fast! ⚡](https://github.com/ArcherGu/fast-vite-nestjs-electron)
* [electron-vite/electron-vite-boilerplate: 📚 Really simple Electron + Vite boilerplate.](https://github.com/electron-vite/electron-vite-boilerplate)
* [cawa-93/vite-electron-builder: Secure boilerplate for Electron app based on Vite. TypeScript + Vue/React/Angular/Svelte/Vanilla](https://github.com/cawa-93/vite-electron-builder/)
* [hydrati/vitectron: Powerful Vue Desktop Application Template](https://github.com/hydrati/vitectron)
* [electron-vite/vite-plugin-electron-renderer: Support use Node.js API in Electron-Renderer](https://github.com/electron-vite/vite-plugin-electron-renderer)
* [Deluze/electron-vue-template: Simple Vue3 + Electron starter template in TypeScript, including ViteJS and Electron Builder](https://github.com/Deluze/electron-vue-template)
* [tada5hi/vitron: This is a library to build beautiful (win, linux, mac) desktop apps for modern web projects with vite and electron.](https://github.com/tada5hi/vitron)
* [jooy2/vutron: 💚 Quick Start Templates for Vite + Electron + Vue 3 + Vuetify + TypeScript. Vutron is a preconfigured template for developing Electron cross-platform desktop apps. It uses Vue 3 and allows you to build a fast development environment with little effort.](https://github.com/jooy2/vutron)
* [caoxiemeihao/vite-electron-plugin: High-performance, esbuild-based Vite Electron plugin](https://github.com/caoxiemeihao/vite-electron-plugin)
* [electron-vite/create-electron-vite: Scaffolding Your Electron + Vite Project](https://github.com/electron-vite/create-electron-vite)
* [electron-vite/vite-plugin-electron: 🔗 ⚡️](https://github.com/electron-vite/vite-plugin-electron)
* [vite-plugin/vite-plugin-target: Make Vite support Electron, Node.js, etc.](https://github.com/vite-plugin/vite-plugin-target)
* [alex8088/electron-vite: Next generation Electron build tooling based on Vite 新一代 Electron 开发构建工具，支持源代码保护](https://github.com/alex8088/electron-vite)
* [alex8088/vite-plugin-electron-config: Electron plugin for Vite](https://github.com/alex8088/vite-plugin-electron-config)


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


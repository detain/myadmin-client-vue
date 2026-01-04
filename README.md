# InterServer MyAdmin Client Interface

Check out the [WIKI](wiki) for documentation.

## FAQ

### Getting a blank page when loading the site

Check your ad blocker or privacy addons, they might need to be disabled for this site.

## Development

* [vitejs/awesome-vite: ⚡️ A curated list of awesome things related to Vite.js](https://github.com/vitejs/awesome-vite)

After this is done on all of the repos pick the best one and setit up .. try to preserve git history

### TODO Road-Map

* **1.0-alpha** MileStone
  * order service pages
    * [ ] server
    * [ ] domain
  * [ ] cart/iids parsed and handled
* **1.0-beta** MileStone
  * [ ] update response codes to match table below
  * [ ] loading / no entries messages
  * services list pages
    * datatables or equivalent
      * [x] filtering
      * [ ] sorting
      * [ ] pagination
      * [ ] print/export
* **1.0-stable** MileStone
  * [ ] setup github actions and hooks for automated testing
  * [ ] make sure affiliate tracking still works
  * [ ] analytics
  * [ ] minimize api fields in requests/responses and filter them for security
  * [ ] api finalized
* Future Tasks
  * [ ] improve webpacking
  * [ ] move type definitions into /types?
  * [ ] utilize the form validation stuff
  * [ ] replace jquery type calls with built in template handling and such
  * [ ] bs5/adminlte4 https://github.com/coliff/bootstrap-5-migrate-tool/blob/main/gulpfile.js  https://gist.github.com/Juan-escobar94/f76535a1264ac6f7251c643af50c184d
  * [ ] ionic capacitor
    * [ ] android build
    * [ ] ios build
  * [x] electron build
    * [x] windows/linux/mac builds
    * [ ] automated builds
    * [x] js/css assets loaded locally


[electron-vite/electron-vite-vue: 🥳 Really simple Electron + Vite + Vue boilerplate.](https://github.com/electron-vite/electron-vite-vue)
[caoxiemeihao/electron-vite-boilerplate: 📚 Really simple Electron + Vite boilerplate.](https://github.com/caoxiemeihao/electron-vite-boilerplate)
[yingpengsha/electron-vite-quick-start: ⚡ Full stack uses Vite to run Electron application, including main process.](https://github.com/yingpengsha/electron-vite-quick-start)
[umbrella22/electron-vite-template: This project is a vue3 + Vite + electron project template composed of Vite and rollup. It has the same functions as my previous electron+Vue+template project](https://github.com/umbrella22/electron-vite-template)
[ArcherGu/fast-vite-electron: Vite + Electron with esbuild, so fast! ⚡](https://github.com/ArcherGu/fast-vite-electron)
[cawa-93/vite-electron-builder: Secure boilerplate for Electron app based on Vite. TypeScript + Vue/React/Angular/Svelte/Vanilla](https://github.com/cawa-93/vite-electron-builder/)
[electron-vite/vite-plugin-electron-renderer: Support use Node.js API in Electron-Renderer](https://github.com/electron-vite/vite-plugin-electron-renderer)
[Deluze/electron-vue-template: Simple Vue3 + Electron starter template in TypeScript, including ViteJS and Electron Builder](https://github.com/Deluze/electron-vue-template)
[tada5hi/vitron: This is a library to build (win, linux, mac) desktop apps for modern web projects with vite and electron.](https://github.com/tada5hi/vitron)
[jooy2/vutron: 💚 Quick Start Templates for Vite + Electron + Vue 3 + Vuetify + TypeScript. Vutron is a preconfigured template for developing Electron cross-platform desktop apps. It uses Vue 3 and allows you to build a fast development environment with little effort.](https://github.com/jooy2/vutron)
[caoxiemeihao/vite-electron-plugin: High-performance, esbuild-based Vite Electron plugin](https://github.com/caoxiemeihao/vite-electron-plugin)


## Features

- Web version for browsers
- Desktop app via Electron
- Auto-update support
- Linux (.AppImage, .deb, Snap)
- Windows (.exe installer, portable)
- macOS (.dmg, .pkg)

## Downloads

<!-- DOWNLOADS-START -->
<!-- DOWNLOADS-END -->

## Installation

### Web
1. Download the ZIP
2. Extract to any folder
3. Open `index.html` in your browser

### Electron
Follow instructions for your platform after downloading the respective installer or ZIP.

### Linux
```bash
# AppImage
chmod +x MyApp-*.AppImage
./MyApp-*.AppImage
```

### Page Status

* Working status does not include the export/sorting related options on the view service list type pages

| Url                             | Working | API Call | API Spec | Breadcrum |
|---------------------------------|---------|----------|----------|-----------|
| /                               | [x]     | [x]      | [x]      | [x]       |
| /login                          | [x]     | [x]      | [x]      |           |
| /sudo/:sessionId                | [x]     |          |          |           |
| /account/info                   | [x]     | [x]      | [x]      | [x]       |
| /account/pass                   | [x]     | [x]      | [x]      | [x]       |
| /account/settings               | [x]     |          |          | [x]       |
| /dns                            | [x]     | [x]      | [x]      | [x]       |
| /dns/:id                        | [x]     | [x]      | [x]      | [x]       |
| /affiliate                      | [x]     |          |          | [x]       |
| /affiliate/faq                  | [x]     |          |          | [x]       |
| /affiliate/status_legend        | [x]     |          |          | [x]       |
| /affiliate/tos                  | [x]     |          |          | [x]       |
| /affiliate/web_traffic          | [x]     | [x]      | [x]      | [x]       |
| /backups                        | [x]     | [x]      | [x]      | [x]       |
| /backups/:id                    | [x]     | [x]      | [x]      | [x]       |
| /backups/:id/cancel             | [x]     | [x]      | [x]      | [x]       |
| /backups/:id/invoices           | [x]     | [x]      | [x]      | [x]       |
| /backups/:id/welcome_email      | [x]     | [x]      | [x]      | [x]       |
| /backups/order                  | [x]     | [x]      | [x]      | [x]       |
| /domains                        | [x]     | [x]      | [x]      | [x]       |
| /domains/:id                    | [x]     | [x]      | [x]      | [x]       |
| /domains/:id/cancel             | [x]     | [x]      | [x]      | [x]       |
| /domains/:id/invoices           | [x]     | [x]      | [x]      | [x]       |
| /domains/:id/welcome_email      | [x]     | [x]      | [x]      | [x]       |
| /floating_ips                   | [x]     | [x]      | [x]      | [x]       |
| /floating_ips/:id/cancel        | [x]     | [x]      | [x]      | [x]       |
| /floating_ips/:id/invoices      | [x]     | [x]      | [x]      | [x]       |
| /floating_ips/:id/welcome_email | [x]     | [x]      | [x]      | [x]       |
| /licenses                       | [x]     | [x]      | [x]      | [x]       |
| /licenses/:id                   | [x]     | [x]      | [x]      | [x]       |
| /licenses/:id/cancel            | [x]     | [x]      | [x]      | [x]       |
| /licenses/:id/invoices          | [x]     | [x]      | [x]      | [x]       |
| /licenses/:id/welcome_email     | [x]     | [x]      | [x]      | [x]       |
| /mail                           | [x]     | [x]      | [x]      | [x]       |
| /mail/:id                       | [x]     | [x]      | [x]      | [x]       |
| /mail/:id/cancel                | [x]     | [x]      | [x]      | [x]       |
| /mail/:id/invoices              | [x]     | [x]      | [x]      | [x]       |
| /mail/:id/welcome_email         | [x]     | [x]      | [x]      | [x]       |
| /qs                             | [x]     | [x]      | [x]      | [x]       |
| /qs/:id                         | [x]     | [x]      | [x]      | [x]       |
| /qs/:id/cancel                  | [x]     | [x]      | [x]      | [x]       |
| /qs/:id/invoices                | [x]     | [x]      | [x]      | [x]       |
| /qs/:id/welcome_email           | [x]     | [x]      | [x]      | [x]       |
| /servers                        | [x]     | [x]      | [x]      | [x]       |
| /servers/:id                    | [x]     | [x]      | [x]      | [x]       |
| /servers/:id/cancel             | [x]     | [x]      | [x]      | [x]       |
| /servers/:id/invoices           | [x]     | [x]      | [x]      | [x]       |
| /servers/:id/welcome_email      | [x]     | [x]      | [x]      | [x]       |
| /ssl/:id/cancel                 | [x]     | [x]      | [x]      | [x]       |
| /ssl/:id/invoices               | [x]     | [x]      | [x]      | [x]       |
| /ssl/:id/welcome_email          | [x]     | [x]      | [x]      | [x]       |
| /vps                            | [x]     | [x]      | [x]      | [x]       |
| /vps/:id                        | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/block_smtp             | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/cancel                 | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/change_timezone        | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/disable_cd             | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/disable_quota          | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/eject_cd               | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/enable_quota           | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/invoices               | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/insert_cd              | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/restart                | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/reinstall_os           | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/reverse_dns            | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/setup_vnc              | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/start                  | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/stop                   | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/view_desktop           | [x]     | [x]      | [x]      | [x]       |
| /vps/:id/welcome_email          | [x]     | [x]      | [x]      | [x]       |
| /websites                       | [x]     | [x]      | [x]      | [x]       |
| /websites/:id                   | [x]     | [x]      | [x]      | [x]       |
| /websites/:id/cancel            | [x]     | [x]      | [x]      | [x]       |
| /websites/:id/invoices          | [x]     | [x]      | [x]      | [x]       |
| /websites/:id/login             | [x]     | [x]      | [x]      | [x]       |
| /websites/:id/welcome_email     | [x]     | [x]      | [x]      | [x]       |
| /register                       | [x]     | [ ]      | [ ]      |           |
| /account/username               | [ ]     | [ ]      | [ ]      | [ ]       |
| /cart                           | [ ]     | [ ]      | [ ]      | [ ]       |
| /cart/::iids                    | [ ]     | [ ]      | [ ]      | [ ]       |
| /invoices                       | [ ]     | [ ]      | [ ]      | [ ]       |
| /payment_types                  | [ ]     | [ ]      | [ ]      | [ ]       |
| /prepays                        | [ ]     | [ ]      | [ ]      | [ ]       |
| /pay/:method/:invoices          | [ ]     | [x]      | [x]      | [ ]       |
| /tickets                        | [ ]     | [ ]      | [ ]      | [ ]       |
| /tickets/:id                    | [ ]     | [ ]      | [ ]      | [ ]       |
| /tickets/new                    | [ ]     | [ ]      | [ ]      | [ ]       |
| /affiliate/banner/:id           | [ ]     |          |          | [ ]       |
| /affiliate/banners              | [ ]     | [x]      | [x]      | [ ]       |
| /affiliate/landing_pg           | [ ]     | [ ]      | [ ]      | [ ]       |
| /affiliate/payment_setup        | [ ]     | [ ]      | [ ]      | [ ]       |
| /affiliate/rich_report          | [ ]     | [ ]      | [ ]      | [ ]       |
| /affiliate/sales_graph          | [ ]     | [ ]      | [ ]      | [ ]       |
| /affiliate/sales_report         | [ ]     | [ ]      | [ ]      | [ ]       |
| /affiliate/traffic_graph        | [ ]     | [ ]      | [ ]      | [ ]       |
| /domains/:id/contact            | [ ]     | [ ]      | [ ]      | [ ]       |
| /domains/:id/dnssec             | [ ]     | [ ]      | [ ]      | [ ]       |
| /domains/:id/nameservers        | [ ]     | [ ]      | [ ]      | [ ]       |
| /domains/:id/renew              | [ ]     | [ ]      | [ ]      | [ ]       |
| /domains/:id/transfer           | [ ]     | [ ]      | [ ]      | [ ]       |
| /domains/:id/whois              | [ ]     | [ ]      | [ ]      | [ ]       |
| /domains/order                  | [ ]     | [ ]      | [ ]      | [ ]       |
| /domains/order/:domain          | [ ]     | [ ]      | [ ]      | [ ]       |
| /domains/order/:domain/:regType | [ ]     | [ ]      | [ ]      | [ ]       |
| /floating_ips/:id               | [ ]     | [ ]      | [ ]      | [ ]       |
| /floating_ips/:id/change_ip     | [ ]     | [ ]      | [ ]      | [ ]       |
| /floating_ips/order             | [ ]     | [ ]      | [ ]      | [ ]       |
| /licenses/:id/change_ip         | [ ]     | [ ]      | [ ]      | [ ]       |
| /licenses/:id/change_os         | [ ]     | [ ]      | [ ]      | [ ]       |
| /licenses/order                 | [ ]     | [ ]      | [ ]      | [ ]       |
| /licenses/order/:catTag         | [ ]     | [ ]      | [ ]      | [ ]       |
| /mail/:id/alerts                | [ ]     | [ ]      | [ ]      | [ ]       |
| /mail/:id/deny_rules            | [ ]     | [ ]      | [ ]      | [ ]       |
| /mail/order                     | [ ]     | [ ]      | [ ]      | [ ]       |
| /qs/:id/backup                  | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/backups                 | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/change_timezone         | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/eject_cd                | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/insert_cd               | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/reinstall_os            | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/reset_password          | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/restart                 | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/restore                 | [ ]     | [ ]      | [ ]      | [ ]       |
| /qs/:id/reverse_dns             | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/setup_vnc               | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/start                   | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/stop                    | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/traffic_usage           | [ ]     | [x]      | [x]      | [ ]       |
| /qs/:id/view_desktop            | [ ]     | [x]      | [x]      | [ ]       |
| /qs/order                       | [ ]     | [ ]      | [ ]      | [ ]       |
| /servers/:id/bandwidth_graph    | [ ]     | [ ]      | [ ]      | [ ]       |
| /servers/:id/ipmi_live          | [ ]     | [ ]      | [ ]      | [ ]       |
| /servers/:id/reverse_dns        | [ ]     | [ ]      | [ ]      | [ ]       |
| /servers/order                  | [ ]     | [ ]      | [ ]      | [ ]       |
| /ssl                            | [ ]     | [ ]      | [ ]      | [ ]       |
| /ssl/:id                        | [ ]     | [ ]      | [ ]      | [ ]       |
| /ssl/:id/change_approver_email  | [ ]     | [ ]      | [ ]      | [ ]       |
| /ssl/:id/resend_approver_email  | [ ]     | [ ]      | [ ]      | [ ]       |
| /ssl/order                      | [ ]     | [ ]      | [ ]      | [ ]       |
| /vps/:id/backup                 | [ ]     | [x]      | [x]      | [ ]       |
| /vps/:id/backups                | [ ]     | [x]      | [x]      | [ ]       |
| /vps/:id/buy_hd_space           | [ ]     | [ ]      | [ ]      | [ ]       |
| /vps/:id/buy_ip                 | [ ]     | [ ]      | [ ]      | [ ]       |
| /vps/:id/change_hostname        | [ ]     | [x]      | [x]      | [ ]       |
| /vps/:id/change_root_password   | [ ]     | [x]      | [x]      | [ ]       |
| /vps/:id/change_webuzo_password | [ ]     | [ ]      | [x]      | [ ]       |
| /vps/:id/reset_password         | [ ]     | [x]      | [x]      | [ ]       |
| /vps/:id/restore                | [ ]     | [ ]      | [x]      | [ ]       |
| /vps/:id/slices                 | [ ]     | [ ]      | [ ]      | [ ]       |
| /vps/:id/traffic_usage          | [ ]     | [x]      | [x]      | [ ]       |
| /vps/order                      | [ ]     | [ ]      | [ ]      | [ ]       |
| /websites/:id/buy_ip            | [ ]     | [ ]      | [ ]      | [ ]       |
| /websites/:id/download_backups  | [ ]     | [ ]      | [ ]      | [ ]       |
| /websites/:id/migration         | [ ]     | [ ]      | [ ]      | [ ]       |
| /websites/:id/reverse_dns       | [ ]     | [ ]      | [ ]      | [ ]       |
| /websites/order                 | [ ]     | [ ]      | [ ]      | [ ]       |

### How it Works

We use Vue 3 with the Composition API to provide an entire website/application in a single page.  This is done using a combination of Vue SFC's (Single File Components) which and the Vue Router to change the url in the browser without actually navigating to a new page.

Variables are mostly handled by reference (like a pointer).  This allows us to pass around variables that are ukept up to date when changed in other sections of the site.

#### Core Functionality

These are the libs which power the majority of the sites functionality.  You should at least breifly read opver each of them.

* [**Vue 3**](https://vuejs.org/guide/introduction.html) is the **Template Engine** with all the modern bells and whistles like automatically updating the display render as data changes.
* [**Pinia**](https://pinia.vuejs.org/introduction.html) is used to provide **Data Stores** which allow us to load data that is reusable between pages without having to reload the data.
* [**Vue Router**](https://router.vuejs.org/installation.html) is used for **Routing** to trigger calling pages based on the url while all being in a single page).

#### Additional Functionality

This stuff provides good features but does not require you to really be famiiar with it.  Skip over these unless you find you need to know more about one of them for some reason.

* [**Vite**](https://vitejs.dev/guide/) is our **Frontend Tooling** system which provides a nice dev setup and handles building the project for production use.
* [**Vite PWA**](https://vite-pwa-org.netlify.app/guide/) automatically generates the the files needed so we are a [**PWA**](https://web.dev/learn/pwa/) (**Progressive Web App**).
* [**Electron**](https://www.electronjs.org/) allows us to build a **Desktop App** for macOS, Windows, Linux, as well as Mobile Device versions.
* [**ESLint**](https://eslint.org/) is our **Linter** which can detect a wide range of problems your code.
* [**Prettier**](https://prettier.io/) is our **Code Formatter** allowing automatic formatting of code based on our set of predefined rules.
* [**Vitest**](https://vitest.dev/guide/) is our **Unit Testing** framework.
* [**VeeValidate**](https://vee-validate.logaretm.com/v4/guide/overview/) is installed for **Form Validation**
* [**Vue-i18n**](https://vue-i18n.intlify.dev/guide/introduction.html) is our **Translation** lib.

#### Inspecting and Debugging The Live Data

There are several Developer Console type interfaces setup which we can use to view and modify the live variables generating the site.

Browser Extension [Vue Devtools](https://devtools.vuejs.org/guide/installation.html)
![vue-devtools-extension](https://github.com/detain/myadmin-client-vue/assets/1364504/536e05be-9653-43ff-acce-2b2080f76a94)

The other way is
![vue-devtools-popup](https://github.com/detain/myadmin-client-vue/assets/1364504/9b502a69-09c4-48b7-ac88-2fe50d4ab15c)

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

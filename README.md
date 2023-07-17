# myadmin-static-client

*If you get a blank page when loading the site, check your adblocker, you might need to disable it*

This template should help get you started developing with Vue 3 in Vite.

## Development

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


### Updated OpenAPI API

While building out this I am creating an OpenAPI based API and utilizing its calls in the client.

#### Notes for HTTP Request Methods cmommonly used when building an API

| HTTP Verb | CRUD           | Entire Collection (e.g. /vps)                                                                        | Specific Item (e.g. /vps/{id})                                             |
|-----------|----------------|------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| POST      | Create         | 201 (Created), 'Location' header with link to /customers/{id} containing new ID.                     | 404 (Not Found), 409 (Conflict) if resource already exists..               |
| GET       | Read           | 200 (OK), list of customers. Use pagination, sorting and filtering to navigate big lists.            | 200 (OK), single customer. 404 (Not Found), if ID not found or invalid.    |
| PUT       | Update/Replace | 405 (Method Not Allowed), unless you want to update/replace every resource in the entire collection. | 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid. |
| PATCH     | Update/Modify  | 405 (Method Not Allowed), unless you want to modify the collection itself.                           | 200 (OK) or 204 (No Content). 404 (Not Found), if ID not found or invalid. |
| DELETE    | Delete         | 405 (Method Not Allowed), unless you want to delete the whole collection---not often desirable.      | 200 (OK). 404 (Not Found), if ID not found or invalid.                     |


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


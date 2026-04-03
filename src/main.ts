import { createApp } from 'vue';
import { createPinia } from 'pinia';
//import { VueQueryPlugin } from '@tanstack/vue-query';
import { createHead } from '@unhead/vue/client';
//import { VueRecaptchaPlugin } from 'vue-recaptcha';
import i18n, { loadCommonMessages, resolveAppLocale, setAppLocale } from './i18n';

import App from './App.vue';
import { router } from './router';

import './plugins/jquery';

//import 'jquery-ui';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'admin-lte/dist/js/adminlte.js';
import './assets/css/admin_darkmode.css';

const app = createApp(App);
const pinia = createPinia();
const head = createHead();
app.use(pinia);
app.use(router);
//app.use(VueQueryPlugin);
app.use(head);
app.use(i18n);
/*app.use(VueRecaptchaPlugin, {
    v2SiteKey: '6LeYMVkUAAAAAOW7Nw0e9rhAxIfH5T9k-JN9pMr2',
    //  v3SiteKey: 'YOUR_V3_SITEKEY_HERE',
});*/
setAppLocale(resolveAppLocale());
loadCommonMessages()
    .catch((err) => {
        console.error('Failed to load i18n messages:', err);
    })
    .finally(() => {
        app.mount('#app');
    });

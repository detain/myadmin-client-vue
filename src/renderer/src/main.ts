import { createApp } from 'vue';
import { createPinia } from 'pinia';
//import { VueQueryPlugin } from '@tanstack/vue-query';
import { createHead } from '@unhead/vue';
import { VueRecaptchaPlugin } from 'vue-recaptcha';
//import { createI18n } from 'vue-i18n'

import App from './App.vue';
import { router } from './router';

const app = createApp(App);
const pinia = createPinia();
const head = createHead();
//const i18n = createI18n({})
app.use(pinia);
app.use(router);
//app.use(VueQueryPlugin);
app.use(head);
app.use(VueRecaptchaPlugin, {
    v2SiteKey: '6LeYMVkUAAAAAOW7Nw0e9rhAxIfH5T9k-JN9pMr2',
    //  v3SiteKey: 'YOUR_V3_SITEKEY_HERE',
});
//app.use(i18n)
app.mount('#app');

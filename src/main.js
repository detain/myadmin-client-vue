import { createApp } from "vue"
import { createPinia } from 'pinia'
import { VueQueryPlugin } from "vue-query"
import { createHead } from "@unhead/vue"
import { VueRecaptchaPlugin } from 'vue-recaptcha'
//import { createI18n } from 'vue-i18n'

import App from './App.vue'
import { router } from './router'
/*
import $ from 'jquery';
import 'jquery';
import jQuery from 'jquery';
import 'jquery-ui/dist/jquery-ui.js';
import Popper from 'popper.js';
import 'jquery-simple-pass-meter';
import 'bootstrap';
*/
//window.jQuery = window.$ = $;
//import jQuery from 'jQuery';
//import 'jquery-ui'
//import 'jquery-ui/ui/widgets/datepicker'; // import the specific jQuery UI widget(s) you need
//import 'jquery-ui/dist/themes/smoothness/jquery-ui.css'
//import '/templates/adminlte/js/jquery.passwordRequirements.js';
/*
import Swal from 'sweetalert2';
//import toastr from 'toastr';
import 'datatables.net';
import 'datatables.net-bs4';
import moment from 'moment';
//import 'daterangepicker';
//import 'tempusdominus-bootstrap-4';
//import 'summernote/dist/summernote-bs4.min.css';
//import 'summernote/dist/summernote-bs4.min.js';
import 'overlayscrollbars/css/OverlayScrollbars.min.css';
import 'overlayscrollbars/js/jquery.overlayScrollbars.min.js';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import 'tablesorter/dist/css/theme.bootstrap.min.css';
import 'tablesorter/dist/js/jquery.tablesorter.min.js';
/*
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/dist/js/adminlte.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min.js';
/* */

const app = createApp(App)
const pinia = createPinia()
const head = createHead()
//const i18n = createI18n({})
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)
app.use(head)
app.use(VueRecaptchaPlugin, {
  v2SiteKey: '6LeYMVkUAAAAAOW7Nw0e9rhAxIfH5T9k-JN9pMr2',
//  v3SiteKey: 'YOUR_V3_SITEKEY_HERE',
})
//app.use(i18n)
app.mount('#app')

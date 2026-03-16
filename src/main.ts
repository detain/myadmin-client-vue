import { createApp } from 'vue';
import { createPinia } from 'pinia';
//import { VueQueryPlugin } from '@tanstack/vue-query';
import { createHead } from '@unhead/vue/client';
//import { VueRecaptchaPlugin } from 'vue-recaptcha';
import i18n, { loadCommonMessages } from './i18n';

import { library, dom } from '@fortawesome/fontawesome-svg-core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addIcons = (...icons: any[]) => icons.forEach((i) => library.add(i));
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faAddressCard, faAlignLeft, faAngleLeft, faArrowLeft, faAt, faAtlas, faAtom,
    faBars, faBell, faBook, faBriefcase, faBullhorn, faBusinessTime,
    faCalendarAlt, faCartPlus, faCashRegister, faCertificate, faChartLine, faCheck, faCheckCircle,
    faClosedCaptioning, faCloud, faCloudMeatball, faCog, faCompactDisc, faCreditCard,
    faDatabase, faDesktop, faDollarSign, faDownload,
    faEdit, faEject, faEnvelope, faEnvelopeOpenText, faExchangeAlt,
    faExclamation, faExclamationTriangle, faExternalLinkAlt, faEye, faEyeSlash,
    faFile, faFileAlt, faFileExport, faFileInvoice, faFileInvoiceDollar, faFileMedical, faFilter,
    faGavel, faGlobe,
    faHandshake, faHdd, faHistory, faHome, faHourglass, faHourglassHalf,
    faIdCard, faImage, faInbox, faInfoCircle,
    faKey,
    faLaptop, faLightbulb, faLink, faList, faLock,
    faMailBulk, faMapMarkerAlt, faMapPin, faMicrochip, faMinus, faMoneyBill,
    faNetworkWired, faNewspaper,
    faPaperPlane, faPaperclip, faPause, faPencilAlt, faPeopleArrows, faPlug, faPlus, faPlusCircle, faPowerOff, faPrint,
    faQuestion,
    faReceipt, faRobot,
    faSearch, faSearchPlus, faServer, faShieldAlt, faShoppingCart, faSignInAlt, faSitemap,
    faSort, faSortUp, faSortDown, faSpinner, faSuitcase, faSync,
    faTable, faTachometerAlt, faThumbsDown, faThumbsUp, faTicketAlt, faTimes, faTimesCircle, faTrash, faTrashAlt, faTv,
    faUpload, faUser, faUserEdit, faUserLock, faUserPlus, faUserSecret, faUserShield, faUsersCog,
    faVideo,
    faWallet, faWarehouse, faWindowMaximize,
} from '@fortawesome/free-solid-svg-icons';
import {
    faBell as farBell, faChartBar as farChartBar, faCheckSquare as farCheckSquare,
    faEdit as farEdit, faEnvelope as farEnvelope, faEnvelopeOpen as farEnvelopeOpen,
    faEye as farEye, faEyeSlash as farEyeSlash, faFileAlt as farFileAlt,
    faHandPointRight as farHandPointRight, faIdCard as farIdCard, faImage as farImage,
    faLightbulb as farLightbulb, faMoneyBillAlt as farMoneyBillAlt,
    faPaperPlane as farPaperPlane, faThumbsUp as farThumbsUp, faTimesCircle as farTimesCircle,
    faTrashAlt as farTrashAlt, faUser as farUser, faUserCircle as farUserCircle,
    faWindowMaximize as farWindowMaximize,
} from '@fortawesome/free-regular-svg-icons';
import {
    faConnectdevelop, faCpanel, faFacebook, faFirefox, faGithub, faGooglePlus,
    faLinux, faPaypal, faTwitter, faWindows, faWordpress,
} from '@fortawesome/free-brands-svg-icons';

// solid icons
addIcons(
    faAddressCard, faAlignLeft, faAngleLeft, faArrowLeft, faAt, faAtlas, faAtom,
    faBars, faBell, faBook, faBriefcase, faBullhorn, faBusinessTime,
    faCalendarAlt, faCartPlus, faCashRegister, faCertificate, faChartLine, faCheck, faCheckCircle,
    faClosedCaptioning, faCloud, faCloudMeatball, faCog, faCompactDisc, faCreditCard,
    faDatabase, faDesktop, faDollarSign, faDownload,
);
addIcons(
    faEdit, faEject, faEnvelope, faEnvelopeOpenText, faExchangeAlt,
    faExclamation, faExclamationTriangle, faExternalLinkAlt, faEye, faEyeSlash,
    faFile, faFileAlt, faFileExport, faFileInvoice, faFileInvoiceDollar, faFileMedical, faFilter,
    faGavel, faGlobe,
    faHandshake, faHdd, faHistory, faHome, faHourglass, faHourglassHalf,
    faIdCard, faImage, faInbox, faInfoCircle, faKey,
    faLaptop, faLightbulb, faLink, faList, faLock,
);
addIcons(
    faMailBulk, faMapMarkerAlt, faMapPin, faMicrochip, faMinus, faMoneyBill,
    faNetworkWired, faNewspaper,
    faPaperPlane, faPaperclip, faPause, faPencilAlt, faPeopleArrows, faPlug, faPlus, faPlusCircle, faPowerOff, faPrint,
    faQuestion, faReceipt, faRobot,
    faSearch, faSearchPlus, faServer, faShieldAlt, faShoppingCart, faSignInAlt, faSitemap,
    faSort, faSortUp, faSortDown, faSpinner, faSuitcase, faSync,
);
addIcons(
    faTable, faTachometerAlt, faThumbsDown, faThumbsUp, faTicketAlt, faTimes, faTimesCircle, faTrash, faTrashAlt, faTv,
    faUpload, faUser, faUserEdit, faUserLock, faUserPlus, faUserSecret, faUserShield, faUsersCog,
    faVideo, faWallet, faWarehouse, faWindowMaximize,
);
// regular icons
addIcons(
    farBell, farChartBar, farCheckSquare, farEdit, farEnvelope, farEnvelopeOpen,
    farEye, farEyeSlash, farFileAlt, farHandPointRight, farIdCard, farImage,
    farLightbulb, farMoneyBillAlt, farPaperPlane, farThumbsUp, farTimesCircle,
    farTrashAlt, farUser, farUserCircle, farWindowMaximize,
);
// brand icons
addIcons(
    faConnectdevelop, faCpanel, faFacebook, faFirefox, faGithub, faGooglePlus,
    faLinux, faPaypal, faTwitter, faWindows, faWordpress,
);

dom.watch();

import App from './App.vue';
import { router } from './router';

import './plugins/jquery';

//import 'jquery-ui';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'admin-lte/dist/js/adminlte.js';
import './assets/css/admin_darkmode.css';

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
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
loadCommonMessages().then(() => {
    app.mount('#app');
});

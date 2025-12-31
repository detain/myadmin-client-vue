import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useAlertStore } from '../stores/alert.store';

import affiliateRoutes from './affiliate.routes';
import usersRoutes from './users.routes';
import accountRoutes from './account.routes';
import ticketRoutes from './ticket.routes';
import dnsRoutes from './dns.routes';
import domainRoutes from './domain.routes';
import backupRoutes from './backup.routes';
import licenseRoutes from './license.routes';
import mailRoutes from './mail.routes';
import floatingIpRoutes from './floating_ip.routes';
import qsRoutes from './qs.routes';
import serverRoutes from './server.routes';
import sslRoutes from './ssl.routes';
import vpsRoutes from './vps.routes';
import websiteRoutes from './website.routes';
import ClientHome from '../views/ClientHome.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import LoginOld from '../views/LoginOld.vue';
import Register from '../views/Register.vue';
import Sudo from '../views/Sudo.vue';
import PrePays from '../views/billing/PrePays.vue';
import PaymentTypes from '../views/billing/PaymentTypes.vue';
import InvoicesList from '../views/billing/InvoicesList.vue';
import Cart from '../views/billing/Cart.vue';
import Pay from '../views/billing/Pay.vue';

/*
import ContactInfo from '../views/account/ContactInfo.vue'
import AccountSettings from '../views/account/AccountSettings.vue'
import ChangePass from '../views/account/ChangePass.vue'
import ChangeUsername from '../views/account/ChangeUsername.vue'

import DnsManager from '../views/dns/DnsManager.vue'
import DnsEditor from '../views/dns/DnsEditor.vue'

import DomainsList from '../views/domains/DomainsList.vue';
import ViewDomain from '../views/domains/ViewDomain.vue';
import OrderDomain from '../views/domains/OrderDomain.vue';

import BackupsList from '../views/backups/BackupsList.vue';
import ViewBackup from '../views/backups/ViewBackup.vue';
import OrderBackup from '../views/backups/OrderBackup.vue';

import LicensesList from '../views/licenses/LicensesList.vue';
import ViewLicense from '../views/licenses/ViewLicense.vue';
import OrderLicense from '../views/licenses/OrderLicense.vue';

import MailList from '../views/mail/MailList.vue';
import ViewMail from '../views/mail/ViewMail.vue';
import OrderMail from '../views/mail/OrderMail.vue';

import QsList from '../views/quickservers/QsList.vue';
import ViewQs from '../views/quickservers/ViewQs.vue';
import OrderQs from '../views/quickservers/OrderQs.vue';

import ServersList from '../views/servers/ServersList.vue';
import ViewServer from '../views/servers/ViewServer.vue';
import OrderServer from '../views/servers/OrderServer.vue';

import SslList from '../views/ssl/SslList.vue';
import ViewSsl from '../views/ssl/ViewSsl.vue';
import OrderSsl from '../views/ssl/OrderSsl.vue';

import VpsList from '../views/vps/VpsList.vue';
import ViewVps from '../views/vps/ViewVps.vue';
import OrderVps from '../views/vps/OrderVps.vue';

import WebsitesList from '../views/webhosting/WebsitesList.vue';
import ViewWebsite from '../views/webhosting/ViewWebsite.vue';
import OrderWebsite from '../views/webhosting/OrderWebsite.vue';

*/

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: ClientHome },
        { path: '/login', component: Login },
        { path: '/login_old', component: LoginOld },
        { path: '/register', component: Register },
        { path: '/sudo/:sessionid', component: Sudo },
        { path: '/prepays', component: PrePays },
        { path: '/payment_types', component: PaymentTypes },
        { path: '/cart', component: Cart },
        { path: '/cart/:iids([\\d,]+)', component: Cart },
        { path: '/pay/:method(cc|paypal|prepay|payza|payssion|payu|ccavenue|cashfree|coinbase)/:invoices', component: Pay },
        { path: '/invoices', component: InvoicesList },
        { ...affiliateRoutes },
        { ...usersRoutes },
        { ...accountRoutes },
        { ...ticketRoutes },
        { ...dnsRoutes },
        { ...domainRoutes },
        { ...backupRoutes },
        { ...licenseRoutes },
        { ...mailRoutes },
        { ...floatingIpRoutes },
        { ...qsRoutes },
        { ...serverRoutes },
        { ...sslRoutes },
        { ...vpsRoutes },
        { ...websiteRoutes },
        /*
    { path: '/contact_info', component: ContactInfo },
    { path: '/change_pass', component: ChangePass },
    { path: '/change_username', component: ChangeUsername },
    { path: '/account_settings', component: AccountSettings },
    { path: '/dns_manager', component: DnsManager },
    { path: '/dns_editor', component: DnsEditor },
    { path: '/view_domains_list', component: DomainsList },
    { path: '/view_domain', component: ViewDomain },
    { path: '/order_domain', component: OrderDomain },
    { path: '/domain_order', component: OrderDomain },
    { path: '/view_backups_list', component: BackupsList },
    { path: '/view_backup', component: ViewBackup },
    { path: '/order_backup', component: OrderBackup },
    { path: '/backup_order', component: OrderBackup },
    { path: '/view_licenses_list', component: LicensesList },
    { path: '/view_license', component: ViewLicense },
    { path: '/order_license', component: OrderLicense },
    { path: '/license_order', component: OrderLicense },
    { path: '/view_mail_list', component: MailList },
    { path: '/view_mail', component: ViewMail },
    { path: '/order_mail', component: OrderMail },
    { path: '/mail_order', component: OrderMail },
    { path: '/view_quickservers_list', component: QsList },
    { path: '/view_qs', component: ViewQs },
    { path: '/order_qs', component: OrderQs },
    { path: '/qs_order', component: OrderQs },
    { path: '/view_servers_list', component: ServersList },
    { path: '/view_server', component: ViewServer },
    { path: '/order_server', component: OrderServer },
    { path: '/server_order', component: OrderServer },
    { path: '/view_ssl_list', component: SslList },
    { path: '/view_ssl', component: ViewSsl },
    { path: '/order_ssl', component: OrderSsl },
    { path: '/ssl_order', component: OrderSsl },
    { path: '/view_vps_list', component: VpsList },
    { path: '/view_vps', component: ViewVps },
    { path: '/order_vps', component: OrderVps },
    { path: '/vps_order', component: OrderVps },
    { path: '/view_websites_list', component: WebsitesList },
    { path: '/view_website', component: ViewWebsite },
    { path: '/order_website', component: OrderWebsite },
    { path: '/website_order', component: OrderWebsite },
    */
        // catch all redirect to home page
        { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
});

router.beforeEach(async (to) => {
    //console.log("We are here:"+to.path);
    const publicPages = ['/login', '/login_old', '/register', '/sudo'];
    const parts = to.path.split('/');
    if (parts.length >= 3) {
        parts.splice(2);
    }
    const checkUrl = parts.join('/');
    const authRequired = !publicPages.includes(checkUrl);
    const authStore = useAuthStore();

    // clear alert on route change
    const alertStore = useAlertStore();
    alertStore.clear();

    // redirect to login page if not logged in and trying to access a restricted page
    if (authRequired && !authStore.sessionId && !authStore.apiKey) {
        authStore.returnUrl = to.fullPath;
        return '/login';
    }
    return true;
});

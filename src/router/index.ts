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

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: () => import('../views/ClientHome.vue') },
        { path: '/login', component: () => import('../views/Login.vue') },
        { path: '/login_old', component: () => import('../views/LoginOld.vue') },
        { path: '/register', component: () => import('../views/Register.vue') },
        { path: '/sudo/:sessionid', component: () => import('../views/Sudo.vue') },
        { path: '/prepays', component: () => import('../views/billing/PrePays.vue') },
        { path: '/payment_types', component: () => import('../views/billing/PaymentTypes.vue') },
        { path: '/cart', component: () => import('../views/billing/Cart.vue') },
        { path: '/cart/:iids([\\d,]+)', component: () => import('../views/billing/Cart.vue') },
        { path: '/pay/:method(cc|paypal|prepay|payza|payssion|payu|ccavenue|cashfree|coinbase)/:invoices', component: () => import('../views/billing/Pay.vue') },
        { path: '/invoices', component: () => import('../views/billing/InvoicesList.vue') },
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
    { path: '/contact_info', component: () => import('../views/account/ContactInfo.vue') },
    { path: '/change_pass', component: () => import('../views/account/ChangePass.vue') },
    { path: '/change_username', component: () => import('../views/account/ChangeUsername.vue') },
    { path: '/account_settings', component: () => import('../views/account/AccountSettings.vue') },
    { path: '/dns_manager', component: () => import('../views/dns/DnsManager.vue') },
    { path: '/dns_editor', component: () => import('../views/dns/DnsEditor.vue') },
    { path: '/view_domains_list', component: () => import('../views/domains/DomainsList.vue') },
    { path: '/view_domain', component: () => import('../views/domains/ViewDomain.vue') },
    { path: '/order_domain', component: () => import('../views/domains/OrderDomain.vue') },
    { path: '/domain_order', component: () => import('../views/domains/OrderDomain.vue') },
    { path: '/view_backups_list', component: () => import('../views/backups/BackupsList.vue') },
    { path: '/view_backup', component: () => import('../views/backups/ViewBackup.vue') },
    { path: '/order_backup', component: () => import('../views/backups/OrderBackup.vue') },
    { path: '/backup_order', component: () => import('../views/backups/OrderBackup.vue') },
    { path: '/view_licenses_list', component: () => import('../views/licenses/LicensesList.vue') },
    { path: '/view_license', component: () => import('../views/licenses/ViewLicense.vue') },
    { path: '/order_license', component: () => import('../views/licenses/OrderLicense.vue') },
    { path: '/license_order', component: () => import('../views/licenses/OrderLicense.vue') },
    { path: '/view_mail_list', component: () => import('../views/mail/MailList.vue') },
    { path: '/view_mail', component: () => import('../views/mail/ViewMail.vue') },
    { path: '/order_mail', component: () => import('../views/mail/OrderMail.vue') },
    { path: '/mail_order', component: () => import('../views/mail/OrderMail.vue') },
    { path: '/view_quickservers_list', component: () => import('../views/quickservers/QsList.vue') },
    { path: '/view_qs', component: () => import('../views/quickservers/ViewQs.vue') },
    { path: '/order_qs', component: () => import('../views/quickservers/OrderQs.vue') },
    { path: '/qs_order', component: () => import('../views/quickservers/OrderQs.vue') },
    { path: '/view_servers_list', component: () => import('../views/servers/ServersList.vue') },
    { path: '/view_server', component: () => import('../views/servers/ViewServer.vue') },
    { path: '/order_server', component: () => import('../views/servers/OrderServer.vue') },
    { path: '/server_order', component: () => import('../views/servers/OrderServer.vue') },
    { path: '/view_ssl_list', component: () => import('../views/ssl/SslList.vue') },
    { path: '/view_ssl', component: () => import('../views/ssl/ViewSsl.vue') },
    { path: '/order_ssl', component: () => import('../views/ssl/OrderSsl.vue') },
    { path: '/ssl_order', component: () => import('../views/ssl/OrderSsl.vue') },
    { path: '/view_vps_list', component: () => import('../views/vps/VpsList.vue') },
    { path: '/view_vps', redirect: (to) => { return to.query.id ? '/vps/'+to.query.id : '/vps'; }},
    { path: '/order_vps', component: () => import('../views/vps/OrderVps.vue') },
    { path: '/vps_order', component: () => import('../views/vps/OrderVps.vue') },
    { path: '/view_websites_list', component: () => import('../views/webhosting/WebsitesList.vue') },
    { path: '/view_website', component: () => import('../views/webhosting/ViewWebsite.vue') },
    { path: '/order_website', component: () => import('../views/webhosting/OrderWebsite.vue') },
    { path: '/website_order', component: () => import('../views/webhosting/OrderWebsite.vue') },
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

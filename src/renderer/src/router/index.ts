import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useAlertStore } from '../stores/alert.store';

export const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: () => import('../views/ClientHome.vue') },
        { path: '/login', component: () => import('../views/Login.vue') },
        { path: '/login_old', component: () => import('../views/LoginOld.vue') },
        { path: '/register', component: () => import('../views/Register.vue') },
        { path: '/sudo/:sessionid', component: () => import('../views/Sudo.vue') },
        { path: '/prepays', component: () => import('../views/billing/PrePays.vue') },
        { path: '/payment_types', component: () => import('../views/billing/PaymentTypes.vue') },
        { path: '/cart', component: () => import('../views/billing/Cart.vue') },
        { path: '/cart/:invoices', component: () => import('../views/billing/Cart.vue') },
        { path: '/pay/:method(cc|paypal|prepay|payza|payssion|payu|ccavenue|cashfree|coinbase|btcpay)/:invoices/:done(done)?', component: () => import('../views/billing/Pay.vue') },
        { path: '/invoices', component: () => import('../views/billing/InvoicesList.vue') },
        { path: '/invoices/:id(\\d+)', component: () => import('../views/billing/InvoicesList.vue') },
        {
            path: '/account',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                //{ path: '', component: () => import('../views/account/ContactInfo.vue') },
                { path: 'info', component: () => import('../views/account/ContactInfo.vue') },
                { path: 'pass', component: () => import('../views/account/ChangePass.vue') },
                { path: 'username', component: () => import('../views/account/ChangeUsername.vue') },
                { path: 'settings', component: () => import('../views/account/AccountSettings.vue') },
            ],
        },
        {
            path: '/users',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/users/List.vue') },
                { path: 'add', component: () => import('../views/users/AddEdit.vue') },
                { path: 'edit/:id', component: () => import('../views/users/AddEdit.vue') },
            ],
        },
        {
            path: '/affiliate',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/billing/affiliates/Affiliate.vue') },
                { path: 'faq', component: () => import('../views/billing/affiliates/Faq.vue') },
                { path: 'landing_pg', component: () => import('../views/billing/affiliates/DockSetup.vue') },
                { path: 'payment_setup', component: () => import('../views/billing/affiliates/PaymentSetup.vue') },
                { path: 'rich_report', component: () => import('../views/billing/affiliates/RichReport.vue') },
                { path: 'sales_graph', component: () => import('../views/billing/affiliates/SalesGraph.vue') },
                { path: 'sales_report', component: () => import('../views/billing/affiliates/Signups.vue') },
                { path: 'status_legend', component: () => import('../views/billing/affiliates/Status.vue') },
                { path: 'tos', component: () => import('../views/billing/affiliates/Tos.vue') },
                { path: 'traffic_graph', component: () => import('../views/billing/affiliates/TrafficGraph.vue') },
                { path: 'web_traffic', component: () => import('../views/billing/affiliates/WebTraffic.vue') },
                { path: 'banners', component: () => import('../views/billing/affiliates/ViewBanners.vue') },
                { path: 'banners/:id', component: () => import('../views/billing/affiliates/ViewBanner.vue') },
            ],
        },
        {
            path: '/tickets',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/tickets/TicketsList.vue') },
                { path: 'new', component: () => import('../views/tickets/NewTicket.vue') },
                { path: ':id', component: () => import('../views/tickets/ViewTicket.vue') },
            ],
        },
        {
            path: '/backups',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/backups/BackupsList.vue') },
                { path: 'order', component: () => import('../views/backups/OrderBackup.vue') },
                { path: ':id(\\d+)', component: () => import('../views/backups/ViewBackup.vue') },
                { path: ':id(\\d+)/:link(login|welcome_email|cancel|invoices)', component: () => import('../views/backups/ViewBackup.vue') },
            ],
        },
        {
            path: '/dns',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/dns/DnsManager.vue') },
                { path: ':id(\\d+)', component: () => import('../views/dns/DnsEditor.vue') },
            ],
        },
        {
            path: '/domains',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/domains/DomainsList.vue') },
                { path: 'order', component: () => import('../views/domains/OrderDomain.vue') },
                { path: 'order/:domain', component: () => import('../views/domains/OrderDomain.vue') },
                { path: 'order/:domain/:regType(register|transfer)', component: () => import('../views/domains/OrderDomain.vue') },
                { path: ':id(\\d+)', component: () => import('../views/domains/ViewDomain.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|contact|nameservers|renew|whois|contact|dnssec|transfer)', component: () => import('../views/domains/ViewDomain.vue') },
            ],
        },
        {
            path: '/floating_ips',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/floating_ips/FloatingIpsList.vue') },
                { path: 'order', component: () => import('../views/floating_ips/OrderFloatingIp.vue') },
                { path: ':id(\\d+)', component: () => import('../views/floating_ips/ViewFloatingIp.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_ip)', component: () => import('../views/floating_ips/ViewFloatingIp.vue') },
            ],
        },
        {
            path: '/licenses',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/licenses/LicensesList.vue') },
                //{ path: 'order/:catTag?', component: () => import('../views/licenses/OrderLicense.vue') },
                { path: 'order', component: () => import('../views/licenses/OrderLicense.vue') },
                { path: 'order/:catTag(directadmin|softaculous|parallels|cpanel|litespeed|cloudlinux)', component: () => import('../views/licenses/OrderLicense.vue') },
                { path: ':id(\\d+)', component: () => import('../views/licenses/ViewLicense.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_ip|change_os)', component: () => import('../views/licenses/ViewLicense.vue') },
            ],
        },
        {
            path: '/mail',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/mail/MailList.vue') },
                { path: 'order', component: () => import('../views/mail/OrderMail.vue') },
                { path: ':id(\\d+)', component: () => import('../views/mail/ViewMail.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|alerts|delist|deny_rules|blocks|send|advsend|rules|stats|log|email_deliverability)', component: () => import('../views/mail/ViewMail.vue') },
                { path: ':id(\\d+)/:link(deny_rules|rules)/:ruleId(\\d+)', component: () => import('../views/mail/ViewMail.vue') },
            ],
        },
        {
            path: '/qs',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/quickservers/QsList.vue') },
                { path: 'order', component: () => import('../views/quickservers/OrderQs.vue') },
                { path: ':id(\\d+)', component: () => import('../views/quickservers/ViewQs.vue') },
                { path: ':id(\\d+)/:link(backup|backups|restore|start|stop|restart|invoices|cancel|reinstall_os|reverse_dns|traffic_usage|setup_vnc|slices|buy_ip|reset_password|view_desktop|change_timezone|insert_cd|eject_cd)', component: () => import('../views/quickservers/ViewQs.vue') },
            ],
        },
        {
            path: '/scrub_ips',
            children: [
                { path: '', component: () => import('../views/scrub_ips/ScrubIpList.vue') },
                { path: ':id(\\d+)', component: () => import('../views/scrub_ips/ViewScrubIp.vue') },
            ],
        },
        {
            path: '/servers',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/servers/ServersList.vue') },
                { path: 'order', component: () => import('../views/servers/OrderServer.vue') },
                { path: 'dedicated', component: () => import('../views/servers/OrderDedicated.vue') },
                { path: ':id(\\d+)', component: () => import('../views/servers/ViewServer.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|bandwidth_graph|ipmi_live|reverse_dns)', component: () => import('../views/servers/ViewServer.vue') },
            ],
        },
        {
            path: '/ssl',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/ssl/SslList.vue') },
                { path: 'order', component: () => import('../views/ssl/OrderSsl.vue') },
                { path: ':id(\\d+)', component: () => import('../views/ssl/ViewSsl.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_approver_email|resend_approver_email)', component: () => import('../views/ssl/ViewSsl.vue') },
            ],
        },
        {
            path: '/vps',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/vps/VpsList.vue') },
                { path: 'order', component: () => import('../views/vps/OrderVps.vue') },
                { path: ':id(\\d+)', component: () => import('../views/vps/ViewVps.vue') },
                { path: ':id(\\d+)/:link(backup|backups|block_smtp|buy_ip|buy_hd_space|cancel|change_hostname|change_root_password|change_timezone|change_webuzo_password|disable_quota|disable_cd|eject_cd|enable_quota|insert_cd|invoices|reinstall_os|reset_password|restart|restore|reset_password|reverse_dns|setup_vnc|slices|start|stop|traffic_usage|view_desktop)', component: () => import('../views/vps/ViewVps.vue') },
            ],
        },
        {
            path: '/websites',
            //component: () => import('../views/billing/affiliates/Layout.vue'),
            children: [
                { path: '', component: () => import('../views/webhosting/WebsitesList.vue') },
                { path: 'order', component: () => import('../views/webhosting/OrderWebsite.vue') },
                { path: ':id(\\d+)', component: () => import('../views/webhosting/ViewWebsite.vue') },
                { path: ':id(\\d+)/:link(login|buy_ip|download_backups|migration|reverse_dns|welcome_email|cancel|invoices)', component: () => import('../views/webhosting/ViewWebsite.vue') },
            ],
        },
        // fallback compatibility routes
        { path: '/contact_info', redirect: '/account/info' },
        { path: '/change_pass', redirect: '/account/pass' },
        { path: '/change_username', redirect: '/account/username' },
        { path: '/account_settings', redirect: '/account/settings' },
        { path: '/dns_manager', redirect: '/dns' },
        { path: '/dns_editor', redirect: (to) => (to.query.id ? `/dns/${to.query.id}` : '/dns') },
        { path: '/view_domain', redirect: (to) => (to.query.id ? `/domains/${to.query.id}` : '/domains') },
        { path: '/view_backup', redirect: (to) => (to.query.id ? `/backups/${to.query.id}` : '/backups') },
        { path: '/view_license', redirect: (to) => (to.query.id ? `/license/${to.query.id}` : '/licenses') },
        { path: '/view_mail', redirect: (to) => (to.query.id ? `/mail/${to.query.id}` : '/mail') },
        { path: '/view_qs', redirect: (to) => (to.query.id ? `/qs/${to.query.id}` : '/qs') },
        { path: '/view_server', redirect: (to) => (to.query.id ? `/servers/${to.query.id}` : '/servers') },
        { path: '/view_ssl', redirect: (to) => (to.query.id ? `/ssl/${to.query.id}` : '/ssl') },
        { path: '/view_vps', redirect: (to) => (to.query.id ? `/vps/${to.query.id}` : '/vps') },
        { path: '/view_website', redirect: (to) => (to.query.id ? `/websites/${to.query.id}` : '/websites') },
        { path: '/view_domains_list', redirect: '/domains' },
        { path: '/view_backups_list', redirect: '/backups' },
        { path: '/view_licenses_list', redirect: '/licenses' },
        { path: '/view_mail_list', redirect: '/mail' },
        { path: '/view_quickservers_list', redirect: '/qs' },
        { path: '/view_servers_list', redirect: '/servers' },
        { path: '/view_ssl_list', redirect: '/ssl' },
        { path: '/view_vps_list', redirect: '/vps' },
        { path: '/view_websites_list', redirect: '/websites' },
        { path: '/order_domain', redirect: '/domains/order' },
        { path: '/domain_order', redirect: '/domains/order' },
        { path: '/order_backup', redirect: '/backups/order' },
        { path: '/backup_order', redirect: '/backups/order' },
        { path: '/order_license', redirect: '/licenses/order' },
        { path: '/license_order', redirect: '/licenses/order' },
        { path: '/order_mail', redirect: '/mail/order' },
        { path: '/mail_order', redirect: '/mail/order' },
        { path: '/order_qs', redirect: '/qs/order' },
        { path: '/qs_order', redirect: '/qs/order' },
        { path: '/order_server', redirect: '/servers/order' },
        { path: '/server_order', redirect: '/servers/order' },
        { path: '/order_ssl', redirect: '/ssl/order' },
        { path: '/ssl_order', redirect: '/ssl/order' },
        { path: '/order_vps', redirect: '/vps/order' },
        { path: '/vps_order', redirect: '/vps/order' },
        { path: '/order_website', redirect: '/websites/order' },
        { path: '/website_order', redirect: '/websites/order' },
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

    // redirect to login page if not logged-in and trying to access a restricted page
    if (authRequired && !authStore.sessionId && !authStore.apiKey) {
        authStore.returnUrl = to.fullPath;
        return '/login';
    }
    return true;
});

import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useAlertStore } from '../stores/alert.store';
//import Layout from '../views/billing/affiliates/Layout.vue';

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
        { path: '/cart/:iids([\\d,]+)', component: () => import('../views/billing/Cart.vue') },
        { path: '/pay/:method(cc|paypal|prepay|payza|payssion|payu|ccavenue|cashfree|coinbase)/:invoices', component: () => import('../views/billing/Pay.vue') },
        { path: '/invoices', component: () => import('../views/billing/InvoicesList.vue') },
        {
            path: '/account',
            //component: Layout,
            children: [
                //{ path: '', component: () => import('../views/account/ContactInfo.vue') },
                { path: 'info', component: () => import('../views/account/ContactInfo.vue') },
                { path: 'pass', component: () => import('../views/account/ChangePass.vue') },
                { path: 'username', component: () => import('../views/account/ChangeUsername.vue') },
                { path: 'settings', component: () => import('../views/account/AccountSettings.vue') },
            ],
        },
        {
            path: '/affiliate',
            //component: Layout,
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
                { path: 'banner/:id(\\d+)', component: () => import('../views/billing/affiliates/ViewBanner.vue') },
            ],
        },
        {
            path: '/backups',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/backups/BackupsList.vue') },
                { path: 'order', component: () => import('../views/backups/OrderBackup.vue') },
                { path: ':id(\\d+)', component: () => import('../views/backups/ViewBackup.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices)', component: () => import('../views/backups/ViewBackup.vue') },
            ],
        },
        {
            path: '/dns',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/dns/DnsManager.vue') },
                { path: ':id(\\d+)', component: () => import('../views/dns/DnsEditor.vue') },
            ],
        },
        {
            path: '/domains',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/domains/DomainsList.vue') },
                { path: 'order', component: () => import('../views/domains/OrderDomain.vue') },
                { path: 'order/:domain', component: () => import('../views/domains/OrderDomain.vue') },
                { path: 'order/:domain/:regType(register|transfer)', component: () => import('../views/domains/OrderDomain.vue') },
                { path: ':id(\\d+)', component: () => import('../views/domains/ViewDomain.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|contact|nameservers|renew|whois|contact|dnssec)', component: () => import('../views/domains/ViewDomain.vue') },
            ],
        },
        {
            path: '/floating_ips',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/floating_ips/FloatingIpsList.vue') },
                { path: 'order', component: () => import('../views/floating_ips/OrderFloatingIp.vue') },
                { path: ':id(\\d+)', component: () => import('../views/floating_ips/ViewFloatingIp.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_ip)', component: () => import('../views/floating_ips/ViewFloatingIp.vue') },
            ],
        },
        {
            path: '/licenses',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/licenses/LicensesList.vue') },
                //{ path: 'order/:catTag?', component: () => import('../views/licenses/OrderLicense.vue') },
                { path: 'order', component: () => import('../views/licenses/OrderLicense.vue') },
                { path: 'order/:catTag', component: () => import('../views/licenses/OrderLicense.vue') },
                { path: ':id(\\d+)', component: () => import('../views/licenses/ViewLicense.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_ip|change_os)', component: () => import('../views/licenses/ViewLicense.vue') },
            ],
        },
        {
            path: '/mail',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/mail/MailList.vue') },
                { path: 'order', component: () => import('../views/mail/OrderMail.vue') },
                { path: ':id(\\d+)', component: () => import('../views/mail/ViewMail.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|alerts|deny_rules)', component: () => import('../views/mail/ViewMail.vue') },
            ],
        },
        {
            path: '/qs',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/quickservers/QsList.vue') },
                { path: 'order', component: () => import('../views/quickservers/OrderQs.vue') },
                { path: ':id(\\d+)', component: () => import('../views/quickservers/ViewQs.vue') },
                { path: ':id(\\d+)/:link(backup|backups|restore|start|stop|restart|invoices|cancel|reinstall_os|reverse_dns|traffic_usage|setup_vnc|slices|buy_ip|reset_password|view_desktop|change_timezone|insert_cd|eject_cd)', component: () => import('../views/quickservers/ViewQs.vue') },
            ],
        },
        {
            path: '/servers',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/servers/ServersList.vue') },
                { path: 'order', component: () => import('../views/servers/OrderServer.vue') },
                { path: ':id(\\d+)', component: () => import('../views/servers/ViewServer.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|bandwidth_graph|ipmi_live|reverse_dns)', component: () => import('../views/servers/ViewServer.vue') },
            ],
        },
        {
            path: '/ssl',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/ssl/SslList.vue') },
                { path: 'order', component: () => import('../views/ssl/OrderSsl.vue') },
                { path: ':id(\\d+)', component: () => import('../views/ssl/ViewSsl.vue') },
                { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_approver_email|resend_approver_email)', component: () => import('../views/ssl/ViewSsl.vue') },
            ],
        },
        {
            path: '/tickets',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/tickets/TicketsList.vue') },
                { path: 'new', component: () => import('../views/tickets/NewTicket.vue') },
                { path: ':id(\\d+)', component: () => import('../views/tickets/ViewTicket.vue') },
            ],
        },
        {
            path: '/users',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/users/List.vue') },
                { path: 'add', component: () => import('../views/users/AddEdit.vue') },
                { path: 'edit/:id', component: () => import('../views/users/AddEdit.vue') },
            ],
        },
        {
            path: '/vps',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/vps/VpsList.vue') },
                { path: 'order', component: () => import('../views/vps/OrderVps.vue') },
                { path: ':id(\\d+)', component: () => import('../views/vps/ViewVps.vue') },
                { path: ':id(\\d+)/:link(backup|backups|block_smtp|buy_ip|buy_hd_space|cancel|change_hostname|change_root_password|change_timezone|change_webuzo_password|disable_quota|disable_cd|eject_cd|enable_quota|insert_cd|invoices|reinstall_os|reset_password|restart|restore|reset_password|reverse_dns|setup_vnc|slices|start|stop|traffic_usage|view_desktop)', component: () => import('../views/vps/ViewVps.vue') },
            ],
        },
        {
            path: '/websites',
            //component: Layout,
            children: [
                { path: '', component: () => import('../views/webhosting/WebsitesList.vue') },
                { path: 'order', component: () => import('../views/webhosting/OrderWebsite.vue') },
                { path: ':id(\\d+)', component: () => import('../views/webhosting/ViewWebsite.vue') },
                { path: ':id(\\d+)/:link(login|buy_ip|download_backups|migration|reverse_dns|welcome_email|cancel|invoices)', component: () => import('../views/webhosting/ViewWebsite.vue') },
            ],
        },
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

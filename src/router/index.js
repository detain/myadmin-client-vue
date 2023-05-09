import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useAlertStore } from '@/stores'
import { ClientHome, Home } from '@/views'
import { TicketsList } from '@/views/tickets'
import { PrePays, PaymentTypes, InvoicesList, Cart } from '@/views/billing'
import affiliateRoutes from './affiliate.routes'
import usersRoutes from './users.routes'
import accountRoutes from './account.routes'
import dnsRoutes from './dns.routes'
import domainRoutes from './domain.routes'
import backupRoutes from './backup.routes'
import licenseRoutes from './license.routes'
import mailRoutes from './mail.routes'
import qsRoutes from './qs.routes'
import serverRoutes from './server.routes'
import sslRoutes from './ssl.routes'
import vpsRoutes from './vps.routes'
import websiteRoutes from './website.routes'
/*
import { ContactInfo, AccountSettings, ChangePass, ChangeUsername } from '@/views/account'
import { DnsManager, DnsEditor } from '@/views/dns'
import { DomainsList, ViewDomain, OrderDomain } from '@/views/domains';
import { BackupsList, ViewBackup, OrderBackup } from '@/views/backups';
import { LicensesList, ViewLicense, OrderLicense } from '@/views/licenses';
import { MailList, ViewMail, OrderMail } from '@/views/mail';
import { QsList, ViewQs, OrderQs } from '@/views/quickservers';
import { ServersList, ViewServer, OrderServer } from '@/views/servers';
import { SslList, ViewSsl, OrderSsl } from '@/views/ssl';
import { VpsList, ViewVps, OrderVps } from '@/views/vps';
import { WebsitesList, ViewWebsite, OrderWebsite } from '@/views/webhosting';
*/

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: ClientHome },
    { path: '/home', component: ClientHome },
    { path: '/tickets_list', component: TicketsList },
    { path: '/prepays', component: PrePays },
    { path: '/payment_types', component: PaymentTypes },
    { path: '/cart', component: Cart },
    { path: '/view_invoices', component: InvoicesList },
    { ...affiliateRoutes },
    { ...usersRoutes },
    { ...accountRoutes },
    { ...dnsRoutes },
    { ...domainRoutes },
    { ...backupRoutes },
    { ...licenseRoutes },
    { ...mailRoutes },
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
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach(async (to) => {
    // clear alert on route change
    const alertStore = useAlertStore()
    alertStore.clear()
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/account/login', '/account/register']
    const authRequired = !publicPages.includes(to.path)
    const authStore = useAuthStore()
    if (authRequired && !authStore.user) {
        authStore.returnUrl = to.fullPath
        return '/account/login'
    }
})

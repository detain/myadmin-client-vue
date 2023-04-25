import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useAlertStore } from '@/stores'
import { ClientHome, Home } from '@/views'
import { TicketsList } from '@/views/tickets'
import dnsRoutes from './dns.routes'
import { DnsManager, DnsEditor } from '@/views/dns'
import { PrePays, PaymentTypes, InvoicesList, Cart } from '@/views/billing'
import { Affiliate  } from '@/views/billing/affiliates'
import { ContactInfo, AccountSettings, ChangePass } from '@/views/account'
import accountRoutes from './account.routes'
import usersRoutes from './users.routes'
import domainRoutes from './domain.routes'
import { DomainsList, ViewDomain, OrderDomain } from '@/views/domains';
import backupRoutes from './backup.routes'
import { BackupsList, ViewBackup, OrderBackup } from '@/views/backups';
import licenseRoutes from './license.routes'
import { LicensesList, ViewLicense, OrderLicense } from '@/views/licenses';
import mailRoutes from './mail.routes'
import { MailList, ViewMail, OrderMail } from '@/views/mail';
import qsRoutes from './qs.routes'
import { QuickserversList, ViewQs, OrderQs } from '@/views/quickservers';
import serverRoutes from './server.routes'
import { ServersList, ViewServer, OrderServer } from '@/views/servers';
import sslRoutes from './ssl.routes'
import { SslList, ViewSsl, OrderSsl } from '@/views/ssl';
import vpsRoutes from './vps.routes'
import { VpsList, ViewVps, OrderVps } from '@/views/vps';
import websiteRoutes from './website.routes'
import { WebsitesList, ViewWebsite, OrderWebsite } from '@/views/webhosting';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: ClientHome },
    { path: '/home', component: ClientHome },
    { path: '/tickets_list', component: TicketsList },
    { path: '/prepays', component: PrePays },
    { path: '/payment_types', component: PaymentTypes },
    { path: '/cart', component: Cart },
    { path: '/affiliate', component: Affiliate },
    { path: '/view_invoices', component: InvoicesList },
    { ...usersRoutes },
    { ...accountRoutes },
    { path: '/contact_info', component: ContactInfo },
    { path: '/change_pass', component: ChangePass },
    { path: '/account_settings', component: AccountSettings },
    { ...dnsRoutes },
    { path: '/dns_manager', component: DnsManager },
    { path: '/dns_editor', component: DnsEditor },
    { ...domainRoutes },
    { path: '/view_domains_list', component: DomainsList },
    { path: '/view_domain', component: ViewDomain },
    { path: '/order_domain', component: OrderDomain },
    { path: '/domain_order', component: OrderDomain },
    { ...backupRoutes },
    { path: '/view_backups_list', component: BackupsList },
    { path: '/view_backup', component: ViewBackup },
    { path: '/order_backup', component: OrderBackup },
    { path: '/backup_order', component: OrderBackup },
    { ...licenseRoutes },
    { path: '/view_licenses_list', component: LicensesList },
    { path: '/view_license', component: ViewLicense },
    { path: '/order_license', component: OrderLicense },
    { path: '/license_order', component: OrderLicense },
    { ...mailRoutes },
    { path: '/view_mail_list', component: MailList },
    { path: '/view_mail', component: ViewMail },
    { path: '/order_mail', component: OrderMail },
    { path: '/mail_order', component: OrderMail },
    { ...qsRoutes },
    { path: '/view_quickservers_list', component: QuickserversList },
    { path: '/view_qs', component: ViewQs },
    { path: '/order_qs', component: OrderQs },
    { path: '/qs_order', component: OrderQs },
    { ...serverRoutes },
    { path: '/view_servers_list', component: ServersList },
    { path: '/view_server', component: ViewServer },
    { path: '/order_server', component: OrderServer },
    { path: '/server_order', component: OrderServer },
    { ...sslRoutes },
    { path: '/view_ssl_list', component: SslList },
    { path: '/view_ssl', component: ViewSsl },
    { path: '/order_ssl', component: OrderSsl },
    { path: '/ssl_order', component: OrderSsl },
    { ...vpsRoutes },
    { path: '/view_vps_list', component: VpsList },
    { path: '/view_vps', component: ViewVps },
    { path: '/order_vps', component: OrderVps },
    { path: '/vps_order', component: OrderVps },
    { ...websiteRoutes },
    { path: '/view_websites_list', component: WebsitesList },
    { path: '/view_website', component: ViewWebsite },
    { path: '/order_website', component: OrderWebsite },
    { path: '/website_order', component: OrderWebsite },
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

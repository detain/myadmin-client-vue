import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useAlertStore } from '@/stores'
import { ClientHome, Home } from '@/views'
import { TicketsList } from '@/views/tickets'
import { DnsManager, DnsEditor } from '@/views/dns'
import { DomainsList, ViewDomain, OrderDomain } from '@/views/domains'
import { VpsList, ViewVps, OrderVps } from '@/views/vps'
import { WebsitesList, ViewWebsite, OrderWebsite } from '@/views/webhosting'
import { BackupsList, ViewBackup, OrderBackup } from '@/views/backups'
import { MailList, ViewMail, OrderMail } from '@/views/mail'
import { LicensesList, ViewLicense, OrderLicense } from '@/views/licenses'
import { QuickserversList, ViewQs, OrderQs } from '@/views/quickservers'
import { ServersList, ViewServer, OrderServer } from '@/views/servers'
import { SslList, ViewSsl, OrderSsl } from '@/views/ssl'
import { PrePays, PaymentTypes, InvoicesList, Cart } from '@/views/billing'
import { Affiliate  } from '@/views/billing/affiliates'
import { ContactInfo, AccountSettings, ChangePass } from '@/views/account'
import accountRoutes from './account.routes'
import usersRoutes from './users.routes'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: ClientHome },
    { path: '/contact_info', component: ContactInfo },
    { path: '/change_pass', component: ChangePass },
    { path: '/account_settings', component: AccountSettings },
    { path: '/tickets_list', component: TicketsList },
    { path: '/dns_manager', component: DnsManager },
    { path: '/dns_editor', component: DnsEditor },
    { path: '/prepays', component: PrePays },
    { path: '/payment_types', component: PaymentTypes },
    { path: '/cart', component: Cart },
    { path: '/affiliate', component: Affiliate },
    { path: '/view_invoices', component: InvoicesList },
    { path: '/view_domains_list', component: DomainsList },
    { path: '/view_domain', component: ViewDomain },
    { path: '/order_domain', component: OrderDomain },
    { path: '/view_vps_list', component: VpsList },
    { path: '/view_vps', component: ViewVps },
    { path: '/order_vps', component: OrderVps },
    { path: '/view_websites_list', component: WebsitesList },
    { path: '/view_website', component: ViewWebsite },
    { path: '/order_website', component: OrderWebsite },
    { path: '/view_backups_list', component: BackupsList },
    { path: '/view_backup', component: ViewBackup },
    { path: '/order_backup', component: OrderBackup },
    { path: '/view_mail_list', component: MailList },
    { path: '/view_mail', component: ViewMail },
    { path: '/order_mail', component: OrderMail },
    { path: '/view_licenses_list', component: LicensesList },
    { path: '/view_license', component: ViewLicense },
    { path: '/order_license', component: OrderLicense },
    { path: '/view_quickservers_list', component: QuickserversList },
    { path: '/view_qs', component: ViewQs },
    { path: '/order_qs', component: OrderQs },
    { path: '/view_servers_list', component: ServersList },
    { path: '/view_server', component: ViewServer },
    { path: '/order_server', component: OrderServer },
    { path: '/view_ssl_list', component: SslList },
    { path: '/view_ssl', component: ViewSsl },
    { path: '/order_ssl', component: OrderSsl },
    { ...accountRoutes },
    { ...usersRoutes },
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

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useAlertStore } from '@/stores'
import { ClientHome, Home } from '@/views'
import { TicketsList } from '@/views/tickets'
import { DnsManager, DnsEditor } from '@/views/dns'
import { PrePays, PaymentTypes, InvoicesList, Cart } from '@/views/billing'
import { Affiliate  } from '@/views/billing/affiliates'
import { ContactInfo, AccountSettings, ChangePass } from '@/views/account'
import accountRoutes from './account.routes'
import usersRoutes from './users.routes'
import domainRoutes from './domain.routes'
import backupRoutes from './backup.routes'
import licenseRoutes from './license.routes'
import mailRoutes from './mail.routes'
import qsRoutes from './qs.routes'
import serverRoutes from './server.routes'
import sslRoutes from './ssl.routes'
import vpsRoutes from './vps.routes'
import websiteRoutes from './website.routes'

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
    { ...accountRoutes },
    { ...usersRoutes },
    { ...domainRoutes },
    { ...backupRoutes },
    { ...licenseRoutes },
    { ...mailRoutes },
    { ...qsRoutes },
    { ...serverRoutes },
    { ...sslRoutes },
    { ...vpsRoutes },
    { ...websiteRoutes },
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

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useAlertStore } from '@/stores'
import { ClientHome, Home, AccountSettings, ChangePass } from '@/views'
import { TicketsList } from '@/views/tickets'
import { PrePays, PaymentTypes, InvoicesList, Cart } from '@/views/billing'
import { Affiliate  } from '@/views/billing/affiliates'
import accountRoutes from './account.routes'
import usersRoutes from './users.routes'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: ClientHome },
    { path: '/change_pass', component: ChangePass },
    { path: '/account_settings', component: AccountSettings },
    { path: '/tickets_list', component: TicketsList },
    { path: '/prepays', component: PrePays },
    { path: '/payment_types', component: PaymentTypes },
    { path: '/cart', component: Cart },
    { path: '/affiliate', component: Affiliate },
    { path: '/view_invoices', component: InvoicesList },
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

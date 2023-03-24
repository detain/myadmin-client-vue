import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useAlertStore } from '@/stores'
import { Home, BugsSuck, AccountSettings, ChangePass } from '@/views'
import accountRoutes from './account.routes'
import usersRoutes from './users.routes'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/changepass', ChangePass },
    { path: '/change_pass', ChangePass },
    { path: '/bugs', BugsSuck },
    { path: '/account_settings', AccountSettings },
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

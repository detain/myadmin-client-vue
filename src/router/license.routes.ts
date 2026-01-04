
export default {
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
};

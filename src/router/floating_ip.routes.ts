
export default {
    path: '/floating_ips',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/floating_ips/FloatingIpsList.vue') },
        { path: 'order', component: () => import('../views/floating_ips/OrderFloatingIp.vue') },
        { path: ':id(\\d+)', component: () => import('../views/floating_ips/ViewFloatingIp.vue') },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_ip)', component: () => import('../views/floating_ips/ViewFloatingIp.vue') },
    ],
};

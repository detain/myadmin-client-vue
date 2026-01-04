
export default {
    path: '/ssl',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/ssl/SslList.vue') },
        { path: 'order', component: () => import('../views/ssl/OrderSsl.vue') },
        { path: ':id(\\d+)', component: () => import('../views/ssl/ViewSsl.vue') },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_approver_email|resend_approver_email)', component: () => import('../views/ssl/ViewSsl.vue') },
    ],
};

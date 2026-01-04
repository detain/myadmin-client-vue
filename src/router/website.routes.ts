
export default {
    path: '/websites',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/webhosting/WebsitesList.vue') },
        { path: 'order', component: () => import('../views/webhosting/OrderWebsite.vue') },
        { path: ':id(\\d+)', component: () => import('../views/webhosting/ViewWebsite.vue') },
        { path: ':id(\\d+)/:link(login|buy_ip|download_backups|migration|reverse_dns|welcome_email|cancel|invoices)', component: () => import('../views/webhosting/ViewWebsite.vue') },
    ],
};

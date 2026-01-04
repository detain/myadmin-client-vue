
export default {
    path: '/servers',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/servers/ServersList.vue') },
        { path: 'order', component: () => import('../views/servers/OrderServer.vue') },
        { path: ':id(\\d+)', component: () => import('../views/servers/ViewServer.vue') },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|bandwidth_graph|ipmi_live|reverse_dns)', component: () => import('../views/servers/ViewServer.vue') },
    ],
};

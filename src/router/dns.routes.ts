
export default {
    path: '/dns',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/dns/DnsManager.vue') },
        { path: ':id(\\d+)', component: () => import('../views/dns/DnsEditor.vue') },
    ],
};

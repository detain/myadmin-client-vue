
export default {
    path: '/domains',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/domains/DomainsList.vue') },
        { path: 'order', component: () => import('../views/domains/OrderDomain.vue') },
        { path: 'order/:domain', component: () => import('../views/domains/OrderDomain.vue') },
        { path: 'order/:domain/:regType(register|transfer)', component: () => import('../views/domains/OrderDomain.vue') },
        { path: ':id(\\d+)', component: () => import('../views/domains/ViewDomain.vue') },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|contact|nameservers|renew|whois|contact|dnssec)', component: () => import('../views/domains/ViewDomain.vue') },
    ],
};

const DomainsList = () => import(/* webpackChunkName: "domains" */ '@/views/domains/DomainsList.vue');
const ViewDomain = () => import(/* webpackChunkName: "domains" */ '@/views/domains/ViewDomain.vue');
const OrderDomain = () => import(/* webpackChunkName: "domains" */ '@/views/domains/OrderDomain.vue');

export default {
    path: '/domains',
    //component: Layout,
    children: [
        { path: '', component: DomainsList },
        { path: 'order', component: OrderDomain },
        { path: 'order/:domain', component: OrderDomain },
        { path: 'order/:domain/:regType(register|transfer)', component: OrderDomain },
        { path: ':id(\\d+)', component: ViewDomain },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|contact|nameservers|renew|whois|contact|dnssec)', component: ViewDomain },
    ],
};

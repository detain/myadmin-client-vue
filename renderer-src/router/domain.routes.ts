import DomainsList from '../views/domains/DomainsList.vue';
import ViewDomain from '../views/domains/ViewDomain.vue';
import OrderDomain from '../views/domains/OrderDomain.vue';

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

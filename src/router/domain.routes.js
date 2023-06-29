import { DomainsList, ViewDomain, OrderDomain } from '@/views/domains';

export default {
  path: '/domains',
  //component: Layout,
  children: [
    { path: '', component: DomainsList },
    { path: 'order', component: OrderDomain },
    { path: 'order/:domain', component: OrderDomain },
    { path: 'order/:domain/:type(register|transfer)', component: OrderDomain },
    { path: ':id(\\d+)', component: ViewDomain },
    { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|contact|nameservers|renew|whois|contact|dnssec)', component: ViewDomain },
  ],
};

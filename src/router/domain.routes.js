import { DomainsList, ViewDomain, OrderDomain } from '@/views/domains';

export default {
    path: '/',
    //component: Layout,
    children: [
        { path: 'view_domains_list', component: DomainsList },
        { path: 'view_domain', component: ViewDomain },
        { path: 'order_domain', component: OrderDomain },
        { path: 'domain_order', component: OrderDomain },
        { path: 'domains',
            //component: Layout,
            children: [
                { path: '', component: DomainsList },
                { path: 'order', component: OrderDomain },
                { path: ':id(\\d+)', component: ViewDomain }
            ]
        }
    ]
};

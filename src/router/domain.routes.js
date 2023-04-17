import { Layout, DomainsList, ViewDomain, OrderDomain } from '@/views/domains';

export default {
    path: '/domains',
    component: Layout,
    children: [
        { path: '', component: DomainsList },
        { path: 'order', component: OrderDomain },
        { path: ':id(\\d+)', component: ViewDomain }
    ]
};

import { Layout, QuickserversList, ViewQs, OrderQs } from '@/views/quickservers';

export default {
    path: '/quickservers',
    component: Layout,
    children: [
        { path: '', component: QuickserversList },
        { path: 'order', component: OrderQs },
        { path: ':id(\\d+)', component: ViewQs }
    ]
};

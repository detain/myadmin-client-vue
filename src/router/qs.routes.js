import { Layout, QsList, ViewQs, OrderQs } from '@/views/quickservers';

export default {
    path: '/qs',
    component: Layout,
    children: [
        { path: '', component: QsList },
        { path: 'order', component: OrderQs },
        { path: ':id(\\d+)', component: ViewQs }
    ]
};

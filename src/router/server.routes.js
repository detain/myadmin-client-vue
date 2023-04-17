import { Layout, ServersList, ViewServer, OrderServer } from '@/views/servers';

export default {
    path: '/servers',
    component: Layout,
    children: [
        { path: '', component: ServersList },
        { path: 'order', component: OrderServer },
        { path: ':id(\\d+)', component: ViewServer }
    ]
};

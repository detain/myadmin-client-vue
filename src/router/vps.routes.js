import { Layout, VpsList, ViewVps, OrderVps } from '@/views/vps';

export default {
    path: '/vps',
    component: Layout,
    children: [
        { path: '', component: VpsList },
        { path: 'order', component: OrderVps },
        { path: ':id(\\d+)', component: ViewVps }
    ]
};

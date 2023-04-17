import { VpsList, ViewVps, OrderVps } from '@/views/vps';

export default {
    path: '/',
    //component: Layout,
    children: [
        { path: 'view_vps_list', component: VpsList },
        { path: 'view_vps', component: ViewVps },
        { path: 'order_vps', component: OrderVps },
        { path: 'vps_order', component: OrderVps },
        { path: 'vps',
            //component: Layout,
            children: [
                { path: '', component: VpsList },
                { path: 'order', component: OrderVps },
                { path: ':id(\\d+)', component: ViewVps }
            ]
        }
    ]
};

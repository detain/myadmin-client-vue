import { ServersList, ViewServer, OrderServer } from '@/views/servers';

export default {
    path: '/',
    //component: Layout,
    children: [
        { path: 'view_servers_list', component: ServersList },
        { path: 'view_server', component: ViewServer },
        { path: 'order_server', component: OrderServer },
        { path: 'server_order', component: OrderServer },
        { path: 'servers',
            //component: Layout,
            children: [
                { path: '', component: ServersList },
                { path: 'order', component: OrderServer },
                { path: ':id(\\d+)', component: ViewServer }
            ]
        }
    ]
};

const ServersList = () => import(/* webpackChunkName: "servers" */ '@/views/servers/ServersList.vue');
const ViewServer = () => import(/* webpackChunkName: "servers" */ '@/views/servers/ViewServer.vue');
const OrderServer = () => import(/* webpackChunkName: "servers" */ '@/views/servers/OrderServer.vue');

export default {
    path: '/servers',
    //component: Layout,
    children: [
        { path: '', component: ServersList },
        { path: 'order', component: OrderServer },
        { path: ':id(\\d+)', component: ViewServer },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|bandwidth_graph|ipmi_live|reverse_dns)', component: ViewServer },
    ],
};

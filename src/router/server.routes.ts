import ServersList from '@/views/servers/ServersList.vue';
import ViewServer from '@/views/servers/ViewServer.vue';
import OrderServer from '@/views/servers/OrderServer.vue';

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

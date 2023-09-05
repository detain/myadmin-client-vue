import QsList from '@/views/quickservers/QsList.vue';
import ViewQs from '@/views/quickservers/ViewQs.vue';
import OrderQs from '@/views/quickservers/OrderQs.vue';

export default {
    path: '/qs',
    //component: Layout,
    children: [
        { path: '', component: QsList },
        { path: 'order', component: OrderQs },
        { path: ':id(\\d+)', component: ViewQs },
        { path: ':id(\\d+)/:link(backup|backups|restore|start|stop|restart|invoices|cancel|reinstall_os|reverse_dns|traffic_usage|setup_vnc|slices|buy_ip|reset_password|view_desktop|change_timezone|insert_cd|eject_cd)', component: ViewQs },
    ],
};

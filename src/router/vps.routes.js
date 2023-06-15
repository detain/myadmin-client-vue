import { VpsList, ViewVps, OrderVps } from '@/views/vps';

export default {
    path: '/vps',
    //component: Layout,
    children: [
        { path: '', component: VpsList },
        { path: 'order', component: OrderVps },
        { path: ':id(\\d+)', component: ViewVps },
        { path: ':id(\\d+)/:link(backup|backups|restore|start|stop|restart|invoices|cancel|reinstall_os|reverse_dns|traffic_usage|setup_vnc|slices|buy_ip|reset_password|view_desktop|change_timezone|insert_cd|eject_cd)', component: ViewVps }
    ]
};

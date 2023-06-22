import { FloatingIpsList, ViewFloatingIp, OrderFloatingIp } from '@/views/floating_ips';

export default {
    path: '/floating_ips',
    //component: Layout,
    children: [
        { path: '', component: FloatingIpsList },
        { path: 'order', component: OrderFloatingIp },
        { path: ':id(\\d+)', component: ViewFloatingIp },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_ip)', component: ViewFloatingIp }
    ]
};

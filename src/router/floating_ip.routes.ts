import FloatingIpsList from '@/views/floating_ips/FloatingIpsList.vue';
import ViewFloatingIp from '@/views/floating_ips/ViewFloatingIp.vue';
import OrderFloatingIp from '@/views/floating_ips/OrderFloatingIp.vue';

export default {
    path: '/floating_ips',
    //component: Layout,
    children: [
        { path: '', component: FloatingIpsList },
        { path: 'order', component: OrderFloatingIp },
        { path: ':id(\\d+)', component: ViewFloatingIp },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_ip)', component: ViewFloatingIp },
    ],
};

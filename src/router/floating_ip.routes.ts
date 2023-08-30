const FloatingIpsList = () => import(/* webpackChunkName: "floating_ips" */ '@/views/floating_ips/FloatingIpsList.vue');
const ViewFloatingIp = () => import(/* webpackChunkName: "floating_ips" */ '@/views/floating_ips/ViewFloatingIp.vue');
const OrderFloatingIp = () => import(/* webpackChunkName: "floating_ips" */ '@/views/floating_ips/OrderFloatingIp.vue');

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

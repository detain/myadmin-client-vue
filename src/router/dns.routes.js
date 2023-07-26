const DnsManager = () => import(/* webpackChunkName: "dns" */ '@/views/dns/DnsManager.vue');
const DnsEditor = () => import(/* webpackChunkName: "dns" */ '@/views/dns/DnsEditor.vue');

export default {
    path: '/dns',
    //component: Layout,
    children: [
        { path: '', component: DnsManager },
        { path: ':id(\\d+)', component: DnsEditor },
    ],
};

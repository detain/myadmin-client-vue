import DnsManager from '@/views/dns/DnsManager.vue';
import DnsEditor from '@/views/dns/DnsEditor.vue';

export default {
    path: '/dns',
    //component: Layout,
    children: [
        { path: '', component: DnsManager },
        { path: ':id(\\d+)', component: DnsEditor },
    ],
};

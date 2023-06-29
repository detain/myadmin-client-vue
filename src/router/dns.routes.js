import { DnsManager, DnsEditor } from '@/views/dns';

export default {
    path: '/dns',
    //component: Layout,
    children: [
        { path: '', component: DnsManager },
        { path: ':id(\\d+)', component: DnsEditor },
    ],
};

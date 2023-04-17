import { Layout, LicensesList, ViewLicense, OrderLicense } from '@/views/licenses';

export default {
    path: '/licenses',
    component: Layout,
    children: [
        { path: '', component: LicensesList },
        { path: 'order', component: OrderLicense },
        { path: ':id(\\d+)', component: ViewLicense }
    ]
};

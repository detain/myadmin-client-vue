import { Layout, LicensesList, ViewLicense, OrderLicense } from '@/views/licenses';

export default {
    path: '/licenses',
    component: Layout,
    children: [
        { path: '', component: LicensesList },
        //{ path: 'order/:catTag?', component: OrderLicense },
        { path: 'order', component: OrderLicense },
        { path: 'order/:catTag', component: OrderLicense },
        { path: ':id(\\d+)', component: ViewLicense },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_ip|change_os)', component: ViewLicense }
    ]
};

import { LicensesList, ViewLicense, OrderLicense } from '@/views/licenses';

export default {
    path: '/',
    //component: Layout,
    children: [
        { path: 'view_licenses_list', component: LicensesList },
        { path: 'view_license', component: ViewLicense },
        { path: 'order_license', component: OrderLicense },
        { path: 'license_order', component: OrderLicense },
        { path: 'licenses',
            //component: Layout,
            children: [
                { path: '', component: LicensesList },
                { path: 'order', component: OrderLicense },
                { path: ':id(\\d+)', component: ViewLicense }
            ]
        }
    ]
};

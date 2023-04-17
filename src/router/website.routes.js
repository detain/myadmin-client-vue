import { Layout, WebsitesList, ViewWebsite, OrderWebsite } from '@/views/webhosting';

export default {
    path: '/websites',
    component: Layout,
    children: [
        { path: '', component: WebsitesList },
        { path: 'order', component: OrderWebsite },
        { path: ':id(\\d+)', component: ViewWebsite }
    ]
};

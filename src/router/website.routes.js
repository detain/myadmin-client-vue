import { WebsitesList, ViewWebsite, OrderWebsite } from '@/views/webhosting';

export default {
    path: '/',
    //component: Layout,
    children: [
        { path: 'view_websites_list', component: WebsitesList },
        { path: 'view_website', component: ViewWebsite },
        { path: 'order_website', component: OrderWebsite },
        { path: 'website_order', component: OrderWebsite },
        { path: 'websites',
            //component: Layout,
            children: [
                { path: '', component: WebsitesList },
                { path: 'order', component: OrderWebsite },
                { path: ':id(\\d+)', component: ViewWebsite }
            ]
        }
    ]
};

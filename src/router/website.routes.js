import { WebsitesList, ViewWebsite, OrderWebsite } from '@/views/webhosting';

export default {
    path: '/websites',
    //component: Layout,
    children: [
        { path: '', component: WebsitesList },
        { path: 'order', component: OrderWebsite },
        { path: ':id(\\d+)', component: ViewWebsite },
        { path: ':id(\\d+)/:link(buy_ip|download_backups|migration|reverse_dns|welcome_email|cancel|invoices)', component: ViewWebsite },
    ],
};

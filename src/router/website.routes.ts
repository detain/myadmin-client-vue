import WebsitesList from '../views/webhosting/WebsitesList.vue';
import ViewWebsite from '../views/webhosting/ViewWebsite.vue';
import OrderWebsite from '../views/webhosting/OrderWebsite.vue';

export default {
    path: '/websites',
    //component: Layout,
    children: [
        { path: '', component: WebsitesList },
        { path: 'order', component: OrderWebsite },
        { path: ':id(\\d+)', component: ViewWebsite },
        { path: ':id(\\d+)/:link(login|buy_ip|download_backups|migration|reverse_dns|welcome_email|cancel|invoices)', component: ViewWebsite },
    ],
};

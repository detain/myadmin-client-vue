const WebsitesList = () => import(/* webpackChunkName: "webhosting" */ '@/views/webhosting/WebsitesList.vue');
const ViewWebsite = () => import(/* webpackChunkName: "webhosting" */ '@/views/webhosting/ViewWebsite.vue');
const OrderWebsite = () => import(/* webpackChunkName: "webhosting" */ '@/views/webhosting/OrderWebsite.vue');

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

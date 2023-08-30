const Affiliate = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/Affiliate.vue')
const ViewBanners = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/ViewBanners.vue')
const DockSetup = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/DockSetup.vue')
const Faq = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/Faq.vue')
const Layout = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/Layout.vue')
const PaymentSetup = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/PaymentSetup.vue')
const RichReport = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/RichReport.vue')
const SalesGraph = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/SalesGraph.vue')
const Signups = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/Signups.vue')
const Status = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/Status.vue')
const Tos = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/Tos.vue')
const TrafficGraph = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/TrafficGraph.vue')
const ViewBanner = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/ViewBanner.vue')
const WebTraffic = () => import(/* webpackChunkName: "affiliates" */ '@/views/billing/affiliates/WebTraffic.vue')

export default {
    path: '/affiliate',
    //component: Layout,
    children: [
        { path: '', component: Affiliate },
        { path: 'faq', component: Faq },
        { path: 'landing_pg', component: DockSetup },
        { path: 'payment_setup', component: PaymentSetup },
        { path: 'rich_report', component: RichReport },
        { path: 'sales_graph', component: SalesGraph },
        { path: 'sales_report', component: Signups },
        { path: 'status_legend', component: Status },
        { path: 'tos', component: Tos },
        { path: 'traffic_graph', component: TrafficGraph },
        { path: 'web_traffic', component: WebTraffic },
        { path: 'banners', component: ViewBanners },
        { path: 'banner/:id(\\d+)', component: ViewBanner },
    ],
};

import Layout from '../views/billing/affiliates/Layout.vue';

export default {
    path: '/affiliate',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/billing/affiliates/Affiliate.vue') },
        { path: 'faq', component: () => import('../views/billing/affiliates/Faq.vue') },
        { path: 'landing_pg', component: () => import('../views/billing/affiliates/DockSetup.vue') },
        { path: 'payment_setup', component: () => import('../views/billing/affiliates/PaymentSetup.vue') },
        { path: 'rich_report', component: () => import('../views/billing/affiliates/RichReport.vue') },
        { path: 'sales_graph', component: () => import('../views/billing/affiliates/SalesGraph.vue') },
        { path: 'sales_report', component: () => import('../views/billing/affiliates/Signups.vue') },
        { path: 'status_legend', component: () => import('../views/billing/affiliates/Status.vue') },
        { path: 'tos', component: () => import('../views/billing/affiliates/Tos.vue') },
        { path: 'traffic_graph', component: () => import('../views/billing/affiliates/TrafficGraph.vue') },
        { path: 'web_traffic', component: () => import('../views/billing/affiliates/WebTraffic.vue') },
        { path: 'banners', component: () => import('../views/billing/affiliates/ViewBanners.vue') },
        { path: 'banner/:id(\\d+)', component: () => import('../views/billing/affiliates/ViewBanner.vue') },
    ],
};

import Affiliate from '../views/billing/affiliates/Affiliate.vue';
import ViewBanners from '../views/billing/affiliates/ViewBanners.vue';
import DockSetup from '../views/billing/affiliates/DockSetup.vue';
import Faq from '../views/billing/affiliates/Faq.vue';
import Layout from '../views/billing/affiliates/Layout.vue';
import PaymentSetup from '../views/billing/affiliates/PaymentSetup.vue';
import RichReport from '../views/billing/affiliates/RichReport.vue';
import SalesGraph from '../views/billing/affiliates/SalesGraph.vue';
import Signups from '../views/billing/affiliates/Signups.vue';
import Status from '../views/billing/affiliates/Status.vue';
import Tos from '../views/billing/affiliates/Tos.vue';
import TrafficGraph from '../views/billing/affiliates/TrafficGraph.vue';
import ViewBanner from '../views/billing/affiliates/ViewBanner.vue';
import WebTraffic from '../views/billing/affiliates/WebTraffic.vue';

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

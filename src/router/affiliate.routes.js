import { Affiliate, Faq, PaymentSetup, RichReport, SalesGraph, Signups, Status, Tos, TrafficGraph, WebTraffic, Banners, ViewBanner  } from '@/views/billing/affiliates'

export default {
    path: '/affiliate',
    component: Layout,
    children: [
        { path: '', component: Affiliate },
        { path: 'faq', component: Faq },
        { path: 'payment_setup', component: PaymentSetup },
        { path: 'rich_report', component: RichReport },
        { path: 'sales_graph', component: SalesGraph },
        { path: 'signups', component: Signups },
        { path: 'status', component: Status },
        { path: 'tos', component: Tos },
        { path: 'traffic_graph', component: TrafficGraph },
        { path: 'web_traffic', component: WebTraffic },
        { path: 'banners', component: Banners },
        { path: 'banner/:id', component: ViewBanner }
    ]
};

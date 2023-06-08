import { Layout, SslList, ViewSsl, OrderSsl } from '@/views/ssl';

export default {
    path: '/ssl_certs',
    component: Layout,
    children: [
        { path: '', component: SslList },
        { path: 'order', component: OrderSsl },
        { path: ':id(\\d+)', component: ViewSsl },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_approver_email|resend_approver_email)', component: ViewSsl }
    ]
};

import { Layout, SslList, ViewSsl, OrderSsl } from '@/views/ssl';

export default {
    path: '/ssl_certs',
    component: Layout,
    children: [
        { path: '', component: SslList },
        { path: 'order', component: OrderSsl },
        { path: ':id(\\d+)', component: ViewSsl }
    ]
};

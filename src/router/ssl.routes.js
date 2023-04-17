import { SslList, ViewSsl, OrderSsl } from '@/views/ssl';

export default {
    path: '/',
    //component: Layout,
    children: [
        { path: 'view_ssl_list', component: SslList },
        { path: 'view_ssl', component: ViewSsl },
        { path: 'order_ssl', component: OrderSsl },
        { path: 'ssl_order', component: OrderSsl },
        { path: 'ssl_certs',
            //component: Layout,
            children: [
                { path: '', component: SslList },
                { path: 'order', component: OrderSsl },
                { path: ':id(\\d+)', component: ViewSsl }
            ]
        }
    ]
};

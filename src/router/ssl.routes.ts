import SslList from '@/views/ssl/SslList.vue';
import ViewSsl from '@/views/ssl/ViewSsl.vue';
import OrderSsl from '@/views/ssl/OrderSsl.vue';

export default {
    path: '/ssl',
    //component: Layout,
    children: [
        { path: '', component: SslList },
        { path: 'order', component: OrderSsl },
        { path: ':id(\\d+)', component: ViewSsl },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|change_approver_email|resend_approver_email)', component: ViewSsl },
    ],
};

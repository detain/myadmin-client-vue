const MailList = () => import(/* webpackChunkName: "mail" */ '@/views/mail/MailList.vue');
const ViewMail = () => import(/* webpackChunkName: "mail" */ '@/views/mail/ViewMail.vue');
const OrderMail = () => import(/* webpackChunkName: "mail" */ '@/views/mail/OrderMail.vue');

export default {
    path: '/mail',
    //component: Layout,
    children: [
        { path: '', component: MailList },
        { path: 'order', component: OrderMail },
        { path: ':id(\\d+)', component: ViewMail },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|alerts|deny_rules)', component: ViewMail },
    ],
};

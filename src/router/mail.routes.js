import { MailList, ViewMail, OrderMail } from '@/views/mail';

export default {
    path: '/',
    //component: Layout,
    children: [
        { path: 'view_mail_list', component: MailList },
        { path: 'view_mail', component: ViewMail },
        { path: 'order_mail', component: OrderMail },
        { path: 'mail_order', component: OrderMail },
        { path: 'mail',
            //component: Layout,
            children: [
                { path: '', component: MailList },
                { path: 'order', component: OrderMail },
                { path: ':id(\\d+)', component: ViewMail }
            ]
        }
    ]
};

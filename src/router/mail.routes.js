import { MailList, ViewMail, OrderMail } from '@/views/mail';

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

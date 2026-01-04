
export default {
    path: '/mail',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/mail/MailList.vue') },
        { path: 'order', component: () => import('../views/mail/OrderMail.vue') },
        { path: ':id(\\d+)', component: () => import('../views/mail/ViewMail.vue') },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices|alerts|deny_rules)', component: () => import('../views/mail/ViewMail.vue') },
    ],
};

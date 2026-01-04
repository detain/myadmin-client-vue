
export default {
    path: '/tickets',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/tickets/TicketsList.vue') },
        { path: 'new', component: () => import('../views/tickets/NewTicket.vue') },
        { path: ':id(\\d+)', component: () => import('../views/tickets/ViewTicket.vue') },
    ],
};

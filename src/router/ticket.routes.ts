const TicketsList = () => import(/* webpackChunkName: "tickets" */ '@/views/tickets/TicketsList.vue');
const ViewTicket = () => import(/* webpackChunkName: "tickets" */ '@/views/tickets/ViewTicket.vue');
const NewTicket = () => import(/* webpackChunkName: "tickets" */ '@/views/tickets/NewTicket.vue');

export default {
    path: '/tickets',
    //component: Layout,
    children: [
        { path: '', component: TicketsList },
        { path: 'new', component: NewTicket },
        { path: ':id(\\d+)', component: ViewTicket },
    ],
};

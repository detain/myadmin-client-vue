import TicketsList from '../views/tickets/TicketsList.vue';
import ViewTicket from '../views/tickets/ViewTicket.vue';
import NewTicket from '../views/tickets/NewTicket.vue';

export default {
    path: '/tickets',
    //component: Layout,
    children: [
        { path: '', component: TicketsList },
        { path: 'new', component: NewTicket },
        { path: ':id(\\d+)', component: ViewTicket },
    ],
};

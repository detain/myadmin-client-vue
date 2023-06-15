import { TicketsList, ViewTicket, NewTicket } from '@/views/tickets';

export default {
    path: '/tickets',
    //component: Layout,
    children: [
        { path: '', component: TicketsList },
        { path: 'new', component: NewTicket },
        { path: ':id(\\d+)', component: ViewTicket },
        //{ path: 'settings', component: AccountSettings },
    ]
};

import { Layout, TicketsList } from '@/views/tickets';

export default {
    path: '/tickets',
    component: Layout,
    children: [
        { path: '', component: TicketsList }
        //{ path: 'settings', component: AccountSettings },
    ]
};

import { QuickserversList, ViewQs, OrderQs } from '@/views/quickservers';

export default {
    path: '/',
    //component: Layout,
    children: [
        { path: 'view_quickservers_list', component: QuickserversList },
        { path: 'view_qs', component: ViewQs },
        { path: 'order_qs', component: OrderQs },
        { path: 'qs_order', component: OrderQs },
        { path: 'quickservers',
            //component: Layout,
            children: [
                { path: '', component: QuickserversList },
                { path: 'order', component: OrderQs },
                { path: ':id(\\d+)', component: ViewQs }
            ]
        }
    ]
};

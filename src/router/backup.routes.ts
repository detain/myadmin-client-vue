const BackupsList = () => import(/* webpackChunkName: "backups" */ '@/views/backups/BackupsList.vue');
const ViewBackup = () => import(/* webpackChunkName: "backups" */ '@/views/backups/ViewBackup.vue');
const OrderBackup = () => import(/* webpackChunkName: "backups" */ '@/views/backups/OrderBackup.vue');

export default {
    path: '/backups',
    //component: Layout,
    children: [
        { path: '', component: BackupsList },
        { path: 'order', component: OrderBackup },
        { path: ':id(\\d+)', component: ViewBackup },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices)', component: ViewBackup },
    ],
};

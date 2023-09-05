import BackupsList from '@/views/backups/BackupsList.vue';
import ViewBackup from '@/views/backups/ViewBackup.vue';
import OrderBackup from '@/views/backups/OrderBackup.vue';

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

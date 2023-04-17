import { Layout, BackupsList, ViewBackup, OrderBackup } from '@/views/backups';

export default {
    path: '/backups',
    component: Layout,
    children: [
        { path: '', component: BackupsList },
        { path: 'order', component: OrderBackup },
        { path: ':id(\\d+)', component: ViewBackup }
    ]
};

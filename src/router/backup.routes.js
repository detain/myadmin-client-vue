import { BackupsList, ViewBackup, OrderBackup } from '@/views/backups';

export default {
    path: '/',
    //component: Layout,
    children: [
        { path: 'view_backups_list', component: BackupsList },
        { path: 'view_backup', component: ViewBackup },
        { path: 'order_backup', component: OrderBackup },
        { path: 'backup_order', component: OrderBackup },
        { path: 'backups',
            //component: Layout,
            children: [
                { path: '', component: BackupsList },
                { path: 'order', component: OrderBackup },
                { path: ':id(\\d+)', component: ViewBackup }
            ]
        }
    ]
};

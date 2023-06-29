import { BackupsList, ViewBackup, OrderBackup } from '@/views/backups';

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

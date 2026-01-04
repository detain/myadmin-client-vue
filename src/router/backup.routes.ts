
export default {
    path: '/backups',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/backups/BackupsList.vue') },
        { path: 'order', component: () => import('../views/backups/OrderBackup.vue') },
        { path: ':id(\\d+)', component: () => import('../views/backups/ViewBackup.vue') },
        { path: ':id(\\d+)/:link(welcome_email|cancel|invoices)', component: () => import('../views/backups/ViewBackup.vue') },
    ],
};


export default {
    path: '/qs',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/quickservers/QsList.vue') },
        { path: 'order', component: () => import('../views/quickservers/OrderQs.vue') },
        { path: ':id(\\d+)', component: () => import('../views/quickservers/ViewQs.vue') },
        { path: ':id(\\d+)/:link(backup|backups|restore|start|stop|restart|invoices|cancel|reinstall_os|reverse_dns|traffic_usage|setup_vnc|slices|buy_ip|reset_password|view_desktop|change_timezone|insert_cd|eject_cd)', component: () => import('../views/quickservers/ViewQs.vue') },
    ],
};

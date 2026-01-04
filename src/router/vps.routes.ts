
export default {
    path: '/vps',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/vps/VpsList.vue') },
        { path: 'order', component: () => import('../views/vps/OrderVps.vue') },
        { path: ':id(\\d+)', component: () => import('../views/vps/ViewVps.vue') },
        { path: ':id(\\d+)/:link(backup|backups|block_smtp|buy_ip|buy_hd_space|cancel|change_hostname|change_root_password|change_timezone|change_webuzo_password|disable_quota|disable_cd|eject_cd|enable_quota|insert_cd|invoices|reinstall_os|reset_password|restart|restore|reset_password|reverse_dns|setup_vnc|slices|start|stop|traffic_usage|view_desktop)', component: () => import('../views/vps/ViewVps.vue') },
    ],
};

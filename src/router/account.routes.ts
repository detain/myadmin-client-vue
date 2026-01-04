
export default {
    path: '/account',
    //component: Layout,
    children: [
        //{ path: '', component: () => import('../views/account/ContactInfo.vue') },
        { path: 'info', component: () => import('../views/account/ContactInfo.vue') },
        { path: 'pass', component: () => import('../views/account/ChangePass.vue') },
        { path: 'username', component: () => import('../views/account/ChangeUsername.vue') },
        { path: 'settings', component: () => import('../views/account/AccountSettings.vue') },
    ],
};

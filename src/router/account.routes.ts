const ContactInfo = () => import(/* webpackChunkName: "accounts" */ '@/views/account/ContactInfo.vue');
const AccountSettings = () => import(/* webpackChunkName: "accounts" */ '@/views/account/AccountSettings.vue');
const ChangePass = () => import(/* webpackChunkName: "accounts" */ '@/views/account/ChangePass.vue');
const ChangeUsername = () => import(/* webpackChunkName: "accounts" */ '@/views/account/ChangeUsername.vue');

export default {
    path: '/account',
    //component: Layout,
    children: [
        //{ path: '', component: ContactInfo },
        { path: 'info', component: ContactInfo },
        { path: 'pass', component: ChangePass },
        { path: 'username', component: ChangeUsername },
        { path: 'settings', component: AccountSettings },
    ],
};

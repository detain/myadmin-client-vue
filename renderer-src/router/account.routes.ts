import ContactInfo from '../views/account/ContactInfo.vue';
import AccountSettings from '../views/account/AccountSettings.vue';
import ChangePass from '../views/account/ChangePass.vue';
import ChangeUsername from '../views/account/ChangeUsername.vue';

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

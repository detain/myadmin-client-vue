import { ContactInfo, AccountSettings, ChangePass, ChangeUsername } from '@/views/account';

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

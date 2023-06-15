import { LoginOld, Login, Register, ContactInfo, AccountSettings, ChangePass, ChangeUsername } from '@/views/account';

export default {
    path: '/account',
    //component: Layout,
    children: [
        //{ path: '', component: ContactInfo },
        { path: 'login', component: Login },
        { path: 'login_old', component: LoginOld },
        { path: 'register', component: Register },
        { path: 'info', component: ContactInfo },
        { path: 'pass', component: ChangePass },
        { path: 'username', component: ChangeUsername },
        { path: 'settings', component: AccountSettings },
    ]
};

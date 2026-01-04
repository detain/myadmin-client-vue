import { storeToRefs, defineStore, getActivePinia, Store, Pinia } from 'pinia';
import { fetchWrapper } from '../helpers/fetchWrapper';

import { router } from '../router/index';

import { useAccountStore } from '../stores/account.store';
import { useAlertStore } from '../stores/alert.store';
import { useSiteStore } from '../stores/site.store';

interface ErrorMessage {
    code: number;
    message: string;
    field?: string;
}

interface ExtendedPinia extends Pinia {
    _s: Map<string, Store>;
}

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        opts: {
            tfa: false,
            verify: false,
            captcha: true,
        },
        logo: '//my.interserver.net/templates/my/logo.png',
        captcha: '',
        language: 'en-US',
        counts: {
            vps: 0,
            websites: 0,
            servers: 0,
        },
        //apiKey: JSON.parse(localStorage.getItem('apiKey')), // your api key
        apiKey: null, // your api key
        sessionId: localStorage.getItem('sessionId'), // your session id
        useHeaders: true, // whether to send auth via headers or cookie
        // initialize state from local storage to enable user to stay logged in
        remember: localStorage.getItem('remember'),
        user: JSON.parse(localStorage.getItem('user') || '{}'),
        returnUrl: null as string | null,
    }),
    getters: {},
    actions: {
        loggedIn() {
            return this.sessionId != null || this.apiKey != null;
        },
        resetStores(): void {
            const pinia = getActivePinia() as ExtendedPinia;
            if (pinia) {
                pinia._s.forEach((store) => store.$reset());
            }
        },
        async sudo(sessionId: string): Promise<void> {
            //console.log("Starting sudo session with sessionId "+sessionId)
            this.resetStores();
            const accountStore = useAccountStore();
            if (this.user == null) {
                this.user = {};
            }
            this.user.sessionId = sessionId;
            this.sessionId = sessionId;
            localStorage.setItem('user', JSON.stringify(this.user));
            localStorage.setItem('sessionId', this.sessionId || '');
            //localStorage.setItem('apiKey', this.apiKey);
            accountStore.load().then((response) => {
                //console.log("starting .then handler for accountStore.load trying to utilize the data");
                this.user.account_id = accountStore.data.account_id;
                this.user.account_lid = accountStore.data.account_lid;
                this.user.gravatar = accountStore.gravatar;
                this.user.ima = 'client'; // accountStore.data.ima;
                this.user.name = accountStore.data.name;
                localStorage.setItem('user', JSON.stringify(this.user));
                // redirect to previous url or default to home page
                console.log('Trying to load a different URL');
                router.push(this.returnUrl || '/');
            });
        },
        async load(): Promise<void> {
            //console.log("Trying to load account/info user info");
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            try {
                const response = await fetchWrapper.get(baseUrl + '/login');
                this.logo = response.logo;
                this.captcha = response.captcha;
                this.language = response.language;
                this.counts = response.counts;
            } catch (error: any) {
                console.log('error:');
                console.log(error);
            }
        },
        async reloadCaptcha(): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            try {
                const response = await fetchWrapper.get(baseUrl + '/captcha');
                this.captcha = response.captcha;
            } catch (error: any) {
                console.log('error:');
                console.log(error);
            }
        },
        async login(loginParams: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            try {
                const user = await fetchWrapper.post(baseUrl + '/login', loginParams);
                this.resetStores();
                this.user = user;
                this.sessionId = user.sessionId;
                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('remember', this.remember || '');
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('sessionId', this.sessionId || '');
                //localStorage.setItem('apiKey', this.apiKey);
                // redirect to previous url or default to home page
                await router.push(this.returnUrl || '/');
            } catch (error: any) {
                console.log('error:');
                console.log(error);
                if (typeof error.field != 'undefined') {
                    if (error.field == 'tfa') {
                        this.opts.tfa = true;
                    } else if (error.field == 'verify') {
                        this.opts.verify = true;
                    } else if (error.field == 'captcha') {
                        this.opts.captcha = true;
                    }
                }
                const alertStore = useAlertStore();
                alertStore.error(error);
            }
        },
        async signup(signupParms: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            try {
                const user = await fetchWrapper.post(baseUrl + '/signup', signupParms);
                this.resetStores();
                this.user = user;
                this.sessionId = user.sessionId;
                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('remember', this.remember || '');
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('sessionId', this.sessionId || '');
                // redirect to previous url or default to home page
                await router.push(this.returnUrl || '/');
            } catch (error: any) {
                console.log('error:');
                console.log(error);
                if (typeof error.field != 'undefined') {
                    if (error.field == 'tfa') {
                        this.opts.tfa = true;
                    } else if (error.field == 'verify') {
                        this.opts.verify = true;
                    } else if (error.field == 'captcha') {
                        this.opts.captcha = true;
                    }
                }
                /*Swal.fire({
                    icon: 'warning',
n,
                    html: error.message
                });*/
                const alertStore = useAlertStore();
                alertStore.error(error);
            }
        },
        async logout(): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            try {
                await fetchWrapper.get(baseUrl + '/logout');
            } catch (error: any) {
                console.log('error:');
                console.log(error);
            }
            this.user = null;
            this.sessionId = null;
            this.apiKey = null;
            localStorage.removeItem('user');
            localStorage.removeItem('sessionId');
            await router.push('/login');
        },
    },
});

import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { router } from '@/router';
import { useAlertStore } from '@/stores';

const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        opts: {
            tfa: false,
            verify: false,
            captcha: true
        },
        logo: '//my.interserver.net/templates/my/logo.png',
        captcha: '',
        language: 'en-US',
        counts: {
            vps: 0,
            websites: 0,
            servers: 0
        },
        // initialize state from local storage to enable user to stay logged in
        remember: localStorage.getItem('remember'),
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null
    }),
    actions: {
        async load() {
            try {
                const response = await fetchWrapper.get(baseUrl + '/login');
                this.logo = response.logo;
                this.captcha = response.captcha;
                this.language = response.language;
                this.counts = response.counts;
            } catch (error) {
                console.log("error:");
                console.log(error);
            }
        },
        async reloadCaptcha() {
            try {
                const response = await fetchWrapper.get(baseUrl + '/captcha');
                this.captcha = response.captcha;
            } catch (error) {
                console.log("error:");
                console.log(error);
            }
        },
        async login(loginParams) {
            try {
                const user = await fetchWrapper.post(baseUrl + '/login', loginParams );
                this.user = user;
                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('remember', this.remember);
                localStorage.setItem('user', JSON.stringify(user));
                // redirect to previous url or default to home page
                await router.push(this.returnUrl || '/');
            } catch (error) {
                console.log("error:");
                console.log(error);
                if (typeof error.field != "undefined") {
                    this.opts[error.field] = true;
                }
                const alertStore = useAlertStore();
                alertStore.error(error);
            }
        },
        async signup(signupParms) {
            try {
                const user = await fetchWrapper.post(baseUrl + '/signup', signupParms );
                this.user = user;
                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('remember', this.remember);
                localStorage.setItem('user', JSON.stringify(user));
                // redirect to previous url or default to home page
                await router.push(this.returnUrl || '/');
            } catch (error) {
                console.log("error:");
                console.log(error);
                if (typeof error.field != "undefined") {
                    this.opts[error.field] = true;
                }
                /*Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    html: error.message
                });*/
                const alertStore = useAlertStore();
                alertStore.error(error);
            }
        },
        async logout() {
            this.user = null;
            localStorage.removeItem('user');
            await router.push('/account/login');
        }
    }
});

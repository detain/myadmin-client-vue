import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { router } from '@/router';
import { useAlertStore } from '@/stores';

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
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null
    }),
    actions: {
        async load() {
            try {
                const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/login');
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
                const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/captcha');
                this.captcha = response.captcha;
            } catch (error) {
                console.log("error:");
                console.log(error);
            }
        },
        async login(loginParams) {
            try {
                const user = await fetchWrapper.post('https://mystage.interserver.net/apiv2/login', loginParams );
                this.user = user;
                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                // redirect to previous url or default to home page
                await router.push(this.returnUrl || '/');
            } catch (error) {
                console.log("error:");
                console.log(error);
                if (typeof error.field != "undefined") {
                    this.opts[field] = true;
                }
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

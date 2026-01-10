import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetchWrapper';
import { useAuthStore } from '../stores/auth.store';
import { useSiteStore } from '../stores/site.store';
import { AccountState } from '../types/account';

export const useAccountStore = defineStore('account', {
    state: (): AccountState => ({
        accountList: [],
        loading: false,
        error: false,
        custid: 0,
        ima: 'client',
        data: {
            account_id: 0,
            account_lid: '',
            status: '',
            pin: 0,
            name: '',
            address: '',
            address2: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
            country: '',
            payment_method: 'paypal',
            ima: 'client',
            company: '',
            currency: 'USD',
            locale: 'auto',
            disable_cc: 0,
            disable_email_notifications: 0,
            disable_server_notifications: 0,
            fraudrecord_score: '',
            maxmind_riskscore: null,
            fraudrecord: {},
            maxmind: {},
            maxmind_score: '',
            gstin: '',
            group: '',
            cc: '',
            cc_auto: 0,
            cc_exp: '',
            cc_type: '',
            cc_whitelist: 0,
            ccs: {},
            ccs_added: 0,
            disable_reinstall: 0,
            disable_reset: 0,
            email: '',
            email_abuse: '',
            email_invoices: '',
            email_settings: {},
            extra: {},
            picture: '',
            affiliate_dock_description: '',
            affiliate_dock_title: '',
            affiliate_payment_method: '',
            affiliate_paypal: '',
            referrer_coupon: '',
            reseller_markup: '',
            facebook_id: '',
            facebook_url: '',
            github_id: '',
            github_url: '',
            google_id: '',
            google_url: '',
            ssh_key: '',
            ssh_key_wrapped: '',
            api_key: '',
            api_key_wrapped: '',
            '2fa_google_key': '',
            '2fa_google_enabled': false,
            '2fa_google': 1,
            '2fa_google_split': '',
            '2fa_google_qr': '',
        },
        ip: '',
        oAuthProviders: {},
        oAuthConfig: {
            callback: 'https://my.interserver.net/oauth/callback.php',
            providers: {},
        },
        oAuthAdapters: [],
        limits: [],
        gravatar: '',
        language: 'en-US',
        countryCurrencies: {},
        enableLocales: true,
        enableCurrencies: false, // whether to show the currency dropdown on the contact info page
    }),
    getters: {},
    actions: {
        async loadOnce(): Promise<void> {
            if (Number(this.data.account_id) == 0) {
                await this.load();
            }
        },
        async register(user: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async load(): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            const keyMap: { [key: string]: string } = {
                package: 'pkg',
            };
            this.loading = true;
            try {
                const response: any = await fetchWrapper.get(`${baseUrl}/account`);
                this.$reset();
                console.log(response);
                this.countryCurrencies = response.countryCurrencies;
                this.custid = response.custid;
                this.data = response.data;
                this.enableCurrencies = response.enableCurrencies;
                this.enableLocales = response.enableLocales;
                this.gravatar = response.gravatar;
                this.ima = response.ima;
                this.ip = response.ip;
                this.language = response.language;
                this.limits = response.limits;
                this.oAuthAdapters = response.oauthadapters;
                this.oAuthConfig = response.oauthconfig;
                this.oAuthProviders = response.oauthproviders;
                this.loading = false;
            } catch (error: any) {
                console.log('api failed');
                console.log(error);
                this.loading = false;
            }
        },
        async update(id: number, params: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.put(`${baseUrl}/${id}`, params);

            // update stored user if the logged-in user updated their own record
            const authStore = useAuthStore();
            if (id === authStore.user.id) {
                // update local storage
                const user = { ...authStore.user, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // update auth user in pinia state
                authStore.user = user;
            }
        },
        async delete(id: number): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            // add isDeleting prop to user being deleted
            //this.accountList.find((x) => x.account_id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.accountList = this.accountList.filter((x) => x.account_id !== id);
        },
    },
});

import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();

export const useAccountStore = defineStore({
    id: 'account',
    state: () => ({
        accountList: [],
        loading: false,
        error: false,
        custid: 0,
        ima: "client",
        data: {
            account_id: "",
            account_lid: "",
            status: "active",
            pin: "",
            name: "",
            address: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
            phone: "",
            country: "",
            payment_method: "paypal",
            ima: "client",
            company: "",
            currency: "USD",
            locale: "auto",
            disable_cc: "0",
            fraudrecord_score: "0",
            maxmind_riskscore: null,
            fraudrecord: [],
            maxmind: {},
            maxmind_score: "0",
            group: "",
            cc: "",
            cc_auto: "0",
            cc_exp: "05/2021",
            cc_type: "visa",
            cc_whitelist: "0",
            ccs: [],
            ccs_added: "0",
            disable_reinstall: "0",
            disable_reset: "0",
            email: "",
            email_abuse: "",
            email_settings: {},
            extra: {},
            picture: "",
            affiliate_dock_description: "Use this coupon when placing an order to get the first month of hosting for only 1 penny.",
            affiliate_dock_title: "Exclusive offer to viewers",
            affiliate_payment_method: "paypal",
            affiliate_paypal: "",
            referrer_coupon: "",
            reseller_markup: "",
            facebook_id: "",
            facebook_url: "",
            github_id: "",
            github_url: "",
            google_id: "",
            google_url: "",
            ssh_key: "",
            ssh_key_wrapped: "",
            api_key: "",
            api_key_wrapped: "",
            "2fa_google_key": "",
            "2fa_google_enabled": false,
            "2fa_google": 1,
            "2fa_google_split": "",
            "2fa_google_qr": ""
        },
        ip: {},
        oauthproviders: {},
        oauthconfig: {
            callback: "https://my.interserver.net/oauth/callback.php",
            providers: {}
        },
        oauthadapters: [],
        limits: [],
        gravatar: '',
        language: 'en-US',
        countryCurrencies: {},
        enableLocales: true,
        enableCurrencies: false, // whether to show the currency dropdown on the contact info page
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async load() {
            const keyMap = {
                'package': 'pkg',
            };
            /*
            this.user = { loading: true };
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.user = { error };
            }
            */
            try {
                const response = await fetchWrapper.get(baseUrl + '/account');
                this.$reset();
                let key, value;
                console.log(response);
                for (key in response) {
                    value = response[key];
                    if (typeof this[key] != 'undefined') {
                        this[key] = value;
                    } else if (typeof this[snakeToCamel(key)] != 'undefined') {
                        this[snakeToCamel(key)] = value;
                    } else if (typeof keyMap[key] != 'undefined') {
                        this[keyMap[key]] = value;
                    } else {
                        console.log("no key '"+key+"' with value '"+value+"'");
                    }
                }
            } catch (error) {
                console.log('api failed');
                console.log(error);
            }


        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);

            // update stored user if the logged in user updated their own record
            const authStore = useAuthStore();
            if (id === authStore.user.id) {
                // update local storage
                const user = { ...authStore.user, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // update auth user in pinia state
                authStore.user = user;
            }
        },
        async delete(id) {
            // add isDeleting prop to user being deleted
            this.accountList.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.accountList = this.accountList.filter(x => x.id !== id);
        }
    }
});

import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/accounts`;

export const useAccountStore = defineStore({
    id: 'account',
    state: () => ({
        accountList: [],
        loading: false,
        error: false,
        custid: "",
        ima: "client",
        csrf_token: "",
        link: "",
        data: {
            group: "",
            address: "",
            city: "",
            country: "",
            disable_cc: "0",
            fraudrecord_score: "0",
            ima: "client",
            maxmind_riskscore: null,
            name: "",
            payment_method: "paypal",
            phone: "",
            pin: "",
            state: "",
            status: "active",
            zip: "",
            account_id: "",
            account_lid: "",
            address2: "",
            affiliate_dock_description: "Use this coupon when placing an order to get the first month of hosting for only 1 penny.",
            affiliate_dock_title: "Exclusive offer to viewers",
            affiliate_payment_method: "paypal",
            affiliate_paypal: "",
            cc: "",
            cc_auto: "0",
            cc_exp: "05/2021",
            cc_type: "visa",
            cc_whitelist: "1",
            ccs: [],
            ccs_added: "14",
            company: "",
            currency: "USD",
            disable_reinstall: "0",
            disable_reset: "0",
            email: "",
            email_abuse: "",
            email_settings: {},
            extra: {},
            facebook_id: "",
            facebook_url: "",
            firstname: "",
            fraudrecord: [],
            github_id: "",
            github_url: "",
            google_id: "",
            google_url: "",
            innertell_id: "",
            lastname: "",
            locale: "auto",
            maxmind: {},
            maxmind_score: "0",
            mb_id: "",
            modernbill_id: "",
            picture: "",
            referrer_coupon: "",
            reseller_markup: "",
            username: "",
            ssh_key: "",
            ssh_key_wrapped: "",
            api_key: "",
            api_key_wrapped: "",
            "2fa_google_key": "",
            "2fa_google_enabled": true,
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
        limits: []
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getSettings() {
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
                const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/account_settings');
                this.$reset();
                let key, value;
                console.log('api success');
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
Z        }
    }
});

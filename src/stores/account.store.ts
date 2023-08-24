import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

interface AccountData {
  account_id: string;
  account_lid: string;
  status: string;
  pin: string;
  name: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  country: string;
  payment_method: string;
  ima: string;
  company: string;
  currency: string;
  locale: string;
  disable_cc: string;
  fraudrecord_score: string;
  maxmind_riskscore: any;
  fraudrecord: any[];
  maxmind: any;
  maxmind_score: string;
  group: string;
  cc: string;
  cc_auto: string;
  cc_exp: string;
  cc_type: string;
  cc_whitelist: string;
  ccs: any[];
  ccs_added: string;
  disable_reinstall: string;
  disable_reset: string;
  email: string;
  email_abuse: string;
  email_settings: any;
  extra: any;
  picture: string;
  affiliate_dock_description: string;
  affiliate_dock_title: string;
  affiliate_payment_method: string;
  affiliate_paypal: string;
  referrer_coupon: string;
  reseller_markup: string;
  facebook_id: string;
  facebook_url: string;
  github_id: string;
  github_url: string;
  google_id: string;
  google_url: string;
  ssh_key: string;
  ssh_key_wrapped: string;
  api_key: string;
  api_key_wrapped: string;
  '2fa_google_key': string;
  '2fa_google_enabled': boolean;
  '2fa_google': number;
  '2fa_google_split': string;
  '2fa_google_qr': string;
}

interface AccountState {
  accountList: any[];
  loading: boolean;
  error: boolean;
  custid: number;
  ima: string;
  data: AccountData;
  ip: any;
  oauthproviders: any;
  oauthconfig: {
    callback: string;
    providers: any;
  };
  oauthadapters: any[];
  limits: any[];
  gravatar: string;
  language: string;
  countryCurrencies: any;
  enableLocales: boolean;
  enableCurrencies: boolean; // whether to show the currency dropdown on the contact info page
}

export const useAccountStore = defineStore({
    id: 'account',
    state: (): AccountState => ({
        accountList: [],
        loading: false,
        error: false,
        custid: 0,
        ima: 'client',
        data: {
            account_id: '',
            account_lid: '',
            status: 'active',
            pin: '',
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
            disable_cc: '0',
            fraudrecord_score: '0',
            maxmind_riskscore: null,
            fraudrecord: [],
            maxmind: {},
            maxmind_score: '0',
            group: '',
            cc: '',
            cc_auto: '0',
            cc_exp: '05/2021',
            cc_type: 'visa',
            cc_whitelist: '0',
            ccs: [],
            ccs_added: '0',
            disable_reinstall: '0',
            disable_reset: '0',
            email: '',
            email_abuse: '',
            email_settings: {},
            extra: {},
            picture: '',
            affiliate_dock_description: 'Use this coupon when placing an order to get the first month of hosting for only 1 penny.',
            affiliate_dock_title: 'Exclusive offer to viewers',
            affiliate_payment_method: 'paypal',
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
        ip: {},
        oauthproviders: {},
        oauthconfig: {
            callback: 'https://my.interserver.net/oauth/callback.php',
            providers: {},
        },
        oauthadapters: [],
        limits: [],
        gravatar: '',
        language: 'en-US',
        countryCurrencies: {},
        enableLocales: true,
        enableCurrencies: false, // whether to show the currency dropdown on the contact info page
    }),
    getters: {

    },
    actions: {
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
            /*
            this.user = { loading: true };
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.user = { error };
            }
            */
            try {
                const response: any = await fetchWrapper.get(baseUrl + '/account');
                this.$reset();
                let key: string, value: any;
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
                        console.log("no key '" + key + "' with value '" + value + "'");
                    }
                }
            } catch (error) {
                console.log('api failed');
                console.log(error);
            }
        },
        async update(id: number, params: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
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
        async delete(id: number): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            // add isDeleting prop to user being deleted
            this.accountList.find((x) => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.accountList = this.accountList.filter((x) => x.id !== id);
        },
    },
});

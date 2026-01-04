import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetchWrapper';
import { snakeToCamel } from '../helpers/snakeToCamel';

import { useAuthStore } from '../stores/auth.store';
import { useSiteStore } from '../stores/site.store';

interface SimpleStringObj {
    [key: string]: any;
}
interface AccountData extends SimpleStringObj {
    account_id: number | null;
    account_lid: string;
    status: string;
    pin: number;
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
    disable_cc: number;
    fraudrecord_score: string;
    maxmind_riskscore: any;
    fraudrecord: FraudRecordResponse | {};
    maxmind: MaxMindResponse | {};
    maxmind_score: string;
    group: string;
    cc: string;
    cc_auto: number;
    cc_exp: string;
    cc_type: string;
    cc_whitelist: number;
    ccs: CCsData;
    ccs_added: number;
    disable_reinstall: number;
    disable_reset: number;
    disable_email_notifications: number;
    disable_server_notifications: number;
    email: string;
    email_abuse: string;
    email_invoices: string;
    email_settings: {
        [key: string]: string;
    };
    extra: {
        [key: string]: any;
    };
    picture: string;
    affiliate_dock_description: string;
    affiliate_dock_title: string;
    affiliate_payment_method: string;
    affiliate_paypal: string;
    referrer_coupon: string;
    reseller_markup: string;
    facebook_id: string;
    facebook_url: string;
    gstin?: string;
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

interface AccountLimit {
    start: string;
    end: string;
}

interface OauthProvider {
    account: string;
    enabled: boolean;
    linked: boolean;
    url: string;
}

interface CCsData {
    [key: number | string]: CCData;
}

interface CCData extends SimpleStringObj {
    cc: string;
    cc_exp: string;
    country: string;
    name: string;
    address: string;
    city: string;
    maxmind: MaxMindResponse;
    maxmind_riskscore: string;
    state: string;
    verified: boolean;
    zip: string;
    delete_text?: string;
    edit_text?: string;
    mask_cc?: string;
    verified_cc?: string;
    verified_text?: string;
    unverified_text?: string;
    v_step?: number;
}

interface FraudRecordResponse {
    code: string;
    count: string;
    reliability: string;
    score: string;
}

interface MaxMindResponse {
    anonymousProxy: string;
    binCountry: string;
    binMatch: string;
    binNameMatch: string;
    binName: string;
    binPhoneMatch: string;
    binPhone: string;
    carderEmail: string;
    cityPostalMatch: string;
    countryCode: string;
    countryMatch: string;
    custPhoneInBillingLoc: string;
    distance: string;
    err: string;
    explanation: string;
    female_name: string;
    freeMail: string;
    highRiskCountry: string;
    highRiskUsername: string;
    ip_accuracyRadius: string;
    ip_areaCode: string;
    ip_asnum: string;
    ip_cityConf: string;
    ip_city: string;
    ip_continentCode: string;
    ip_corporateProxy: string;
    ip_countryConf: string;
    ip_countryName: string;
    ip_domain: string;
    ip_isp: string;
    ip_latitude: string;
    ip_longitude: string;
    ip_metroCode: string;
    ip_netSpeedCell: string;
    ip_org: string;
    ip_postalCode: string;
    ip_postalConf: string;
    ip_regionConf: string;
    ip_regionName: string;
    ip_region: string;
    ip_timeZone: string;
    ip_userType: string;
    maxmindID: string;
    proxyScore: string;
    queriesRemaining: string;
    riskScore: string;
    score: string;
    shipCityPostalMatch: string;
}

interface OAuthProviders {
    [key: string]: OauthProvider;
}
interface AccountState {
    accountList: AccountData[];
    loading: boolean;
    error: boolean;
    custid: number;
    ima: string;
    data: AccountData;
    ip: string;
    oauthproviders: OAuthProviders;
    oauthconfig: {
        callback: string;
        providers: OAuthProviders;
    };
    oauthadapters: {
        [key: string]: any;
    };
    limits: AccountLimit[];
    gravatar: string;
    language: string;
    countryCurrencies: {
        [key: string]: string[];
    };
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
    getters: {},
    actions: {
        async loadOnce(): Promise<void> {
            if (Number(this.data.account_id) == 0) {
                this.load();
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
                const response: any = await fetchWrapper.get(baseUrl+'/account');
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
                this.oauthadapters = response.oauthadapters;
                this.oauthconfig = response.oauthconfig;
                this.oauthproviders = response.oauthproviders;
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
            //this.accountList.find((x) => x.account_id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.accountList = this.accountList.filter((x) => x.account_id !== id);
        },
    },
});

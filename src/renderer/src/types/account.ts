
export  interface SimpleStringObj {
    [key: string]: any;
}
export interface AccountData extends SimpleStringObj {
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

export interface AccountLimit {
    start: string;
    end: string;
}

export interface OauthProvider {
    account: string;
    enabled: boolean;
    linked: boolean;
    url: string;
}

export interface CCsData {
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

export interface FraudRecordResponse {
    code: string;
    count: string;
    reliability: string;
    score: string;
}

export interface MaxMindResponse {
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

export interface oAuthProviders {
    [key: string]: OauthProvider;
}

export interface oAuthConfig {
    callback: string;
    providers: oAuthProviders;
}

export interface oAuthAdapters {
    [key: string]: any;
}

export interface AccountState {
    accountList: AccountData[];
    loading: boolean;
    error: boolean;
    custid: number;
    ima: string;
    data: AccountData;
    ip: string;
    oAuthProviders: oAuthProviders;
    oAuthConfig: oAuthConfig;
    oAuthAdapters: oAuthAdapters;
    limits: AccountLimit[];
    gravatar: string;
    language: string;
    countryCurrencies: {
        [key: string]: string[];
    };
    enableLocales: boolean;
    enableCurrencies: boolean; // whether to show the currency dropdown on the contact info page
}

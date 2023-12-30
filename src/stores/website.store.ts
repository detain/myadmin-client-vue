import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { snakeToCamel } from '@/helpers/snakeToCamel.ts';

import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '@/types/view-service-common';
import { useAuthStore } from '@/stores/auth.store.ts';
import { useSiteStore } from '@/stores/site.store.ts';


interface WebsiteInfo {
    website_id: number;
    website_server: number;
    website_type: number;
    website_currency: string;
    website_order_date: string;
    website_custid: number;
    website_ip: string;
    website_status: string;
    website_invoice: number;
    website_coupon: number;
    website_extra: string;
    website_hostname: string;
    website_comment: string;
    website_username: string;
    website_server_status: string;
}

interface WebsiteServiceMaster {
    website_id: number;
    website_name: string;
    website_ip: string;
    website_type: number;
    website_available: number;
    website_hdsize: number;
    website_hdfree: number;
    website_load: number;
    website_last_update: string;
    website_max_sites: number;
    website_order: number;
    website_partitions: string;
    website_dns1: string;
    website_dns2: string;
}

interface WebsiteState {
    websiteList: WebsiteInfo[];
    serviceInfo: WebsiteInfo;
    serviceMaster: WebsiteServiceMaster;
    loading: boolean;
    error: boolean | string;
    linkDisplay: boolean | string;
    pkg: string;
    clientLinks: ClientLink[];
    billingDetails: BillingDetails;
    custCurrency: string;
    custCurrencySymbol: string;
    serviceExtra: any;
    extraInfoTables: ExtraInfoTables;
}

export const useWebsiteStore = defineStore({
    id: 'website',
    state: (): WebsiteState => ({
        websiteList: [],
        loading: false,
        error: false,
        pkg: '',
        linkDisplay: false,
        serviceInfo: {
            website_id: 0,
            website_server: 0,
            website_type: 0,
            website_currency: 'USD',
            website_order_date: '',
            website_custid: 0,
            website_ip: '',
            website_status: '',
            website_invoice: 0,
            website_coupon: 0,
            website_extra: '[]',
            website_hostname: '',
            website_comment: '',
            website_username: '',
            website_server_status: '',
        },
        clientLinks: [],
        billingDetails: {
            service_last_invoice_date: '',
            service_payment_status: '',
            service_frequency: '',
            next_date: '',
            service_next_invoice_date: '',
            service_currency: 'USD',
            service_currency_symbol: '$',
            service_coupon: '',
            service_cost_info: '0.00',
            service_extra: [],
        },
        custCurrency: 'USD',
        custCurrencySymbol: '$',
        serviceMaster: {
            website_id: 0,
            website_name: '',
            website_ip: '',
            website_type: 0,
            website_available: 1,
            website_hdsize: 0,
            website_hdfree: 0,
            website_load: 0.0,
            website_last_update: '',
            website_max_sites: 300,
            website_order: 0,
            website_partitions: '',
            website_dns1: '',
            website_dns2: '',
        },
        serviceExtra: [],
        extraInfoTables: {
            links: {
                title: 'External Links',
                rows: [],
            },
            preview: {
                title: 'Website Preview',
                rows: [],
            },
            dns: {
                title: 'Default DNS Servers',
                rows: [],
            },
        },
    }),
    getters: {
        titleField: (state) => state.serviceInfo.website_hostname,
        titleField2: (state) => state.serviceInfo.website_username,
        titleField3: (state) => state.serviceInfo.website_ip
    },
    actions: {
        async register(user: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll(): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                this.websiteList = await fetchWrapper.get(baseUrl + '/websites');
            } catch (error: any) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
        async getById(id: number | string): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            const keyMap = {
                package: 'pkg',
            };
            try {
                const response = await fetchWrapper.get(baseUrl + '/websites/' + id);
                this.$reset();
                //let key, value;
                console.log(response);
                this.serviceInfo = response.serviceInfo;
                this.clientLinks = response.client_links;
                this.billingDetails = response.billingDetails;
                this.custCurrency = response.custCurrency;
                this.custCurrencySymbol = response.custCurrencySymbol;
                this.serviceMaster = response.serviceMaster;
                this.pkg = response.package;
                this.serviceExtra = response.serviceExtra;
                this.extraInfoTables = response.extraInfoTables;
                /*
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
                */
            } catch (error: any) {
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
            // add isDeleting prop to user being deleted
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            //this.websiteList.find((x) => x.website_id === id).isDeleting = true;
            await fetchWrapper.delete(`${baseUrl}/${id}`);
            // remove user from list after deleted
            this.websiteList = this.websiteList.filter((x) => x.website_id !== id);
        },
    },
});

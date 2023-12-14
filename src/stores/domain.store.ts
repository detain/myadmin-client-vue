import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { snakeToCamel } from '@/helpers/snakeToCamel.ts';

import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '@/types/view-service-common';
import { useAuthStore } from '@/stores/auth.store.ts';
import { useSiteStore } from '@/stores/site.store.ts';


interface DomainInfo {
    domain_id: number;
    domain_hostname: string;
    domain_username: string;
    domain_password: string;
    domain_status: string;
    domain_type: number;
    domain_expire_date: string;
    domain_order_date: string;
    domain_custid: number;
    domain_invoice: number;
    domain_coupon: number;
    domain_firstname: string;
    domain_lastname: string;
    domain_email: string;
    domain_address: string;
    domain_address2: string;
    domain_address3: string;
    domain_city: string;
    domain_state: string;
    domain_zip: string;
    domain_country: string;
    domain_phone: string;
    domain_fax: string;
    domain_company: string;
}

interface DomainState {
    domainList: DomainInfo[];
    serviceInfo: DomainInfo;
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
    serviceType: ServiceType;
    serviceTypes: {
        [key: string]: ServiceType;
    };
    contact_details: {
        first_name: string;
        last_name: string;
        org_name: string;
        status: string;
        email: string;
        address1: string;
        address2: string;
        address3: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        phone: string;
        fax: string;
    };
    pwarning: string;
    transfer_info: string;
    errors: boolean;
    domain_logs: [];
    allInfo: any;
    registrarStatus: string;
    locked: string;
    whoisPrivacy: string;
    autoRenew: string;
}

export const useDomainStore = defineStore({
    id: 'domain',
    state: (): DomainState => ({
        domainList: [],
        loading: false,
        error: false,
        pkg: '',
        linkDisplay: false,
        serviceInfo: {
            domain_id: 0,
            domain_hostname: '',
            domain_username: '',
            domain_password: '',
            domain_status: '',
            domain_type: 0,
            domain_expire_date: '',
            domain_order_date: '',
            domain_custid: 0,
            domain_invoice: 0,
            domain_coupon: 0,
            domain_firstname: '',
            domain_lastname: '',
            domain_email: '',
            domain_address: '',
            domain_address2: '',
            domain_address3: '',
            domain_city: '',
            domain_state: '',
            domain_zip: '',
            domain_country: '',
            domain_phone: '',
            domain_fax: '',
            domain_company: '',
        },
        serviceTypes: {},
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
        serviceExtra: {},
        extraInfoTables: {},
        serviceType: {
            services_id: 0,
            services_name: '',
            services_cost: 0,
            services_category: 0,
            services_buyable: 0,
            services_type: 0,
            services_field1: '',
            services_field2: '',
            services_module: 'domains',
        },
        contact_details: {
            first_name: '',
            last_name: '',
            org_name: '',
            status: '',
            email: '',
            address1: '',
            address2: '',
            address3: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
            phone: '',
            fax: '',
        },
        pwarning: '',
        transfer_info: '',
        errors: false,
        domain_logs: [],
        allInfo: {},
        registrarStatus: '',
        locked: '',
        whoisPrivacy: '',
        autoRenew: '',
    }),
    getters: {},
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
                const response = await fetchWrapper.get(baseUrl + '/domains');
                this.domainList = response;
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
                const response = await fetchWrapper.get(baseUrl + '/domains/' + id);
                this.$reset();
                console.log(response);
                this.serviceInfo = response.serviceInfo;
                this.serviceTypes = response.serviceTypes;
                this.clientLinks = response.client_links;
                this.billingDetails = response.billingDetails;
                this.custCurrency = response.custCurrency;
                this.custCurrencySymbol = response.custCurrencySymbol;
                this.serviceExtra = response.serviceExtra;
                this.extraInfoTables = response.extraInfoTables;
                this.serviceType = response.serviceType;
                this.contact_details = response.contact_details;
                this.pwarning = response.pwarning;
                this.transfer_info = response.transfer_info;
                this.errors = response.errors;
                this.domain_logs = response.domain_logs;
                this.allInfo = response.allInfo;
                this.registrarStatus = response.registrarStatus;
                this.locked = response.locked;
                this.whoisPrivacy = response.whoisPrivacy;
                this.autoRenew = response.autoRenew;
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
            //this.domainList.find((x) => x.domain_id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.domainList = this.domainList.filter((x) => x.domain_id !== id);
        },
    },
});

import { defineStore } from 'pinia';
import fetchWrapper from '@/helpers/fetchWrapper.ts';
import snakeToCamel from '@/helpers/snakeToCamel.ts';

import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '@/types/view-service-common';
import useAuthStore from '@/stores/auth.store.ts';
import useSiteStore from '@/stores/site.store.ts';


interface LicenseInfo {
    license_id: number;
    license_type: number;
    license_currency: string;
    license_order_date: string;
    license_custid: number;
    license_ip: string;
    license_status: string;
    license_hostname: string;
    license_key: string;
    license_invoice: number;
    license_coupon: number;
    license_extra: string;
}

interface LicenseState {
    licenseList: LicenseInfo[];
    serviceInfo: LicenseInfo;
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
    serviceOverviewExtra: any;
    serviceType: ServiceType;
}

export const useLicenseStore = defineStore({
    id: 'license',
    state: (): LicenseState => ({
        licenseList: [],
        loading: false,
        error: false,
        linkDisplay: false,
        pkg: '',
        serviceInfo: {
            license_id: 0,
            license_type: 0,
            license_currency: 'USD',
            license_order_date: '',
            license_custid: 0,
            license_ip: '',
            license_status: '',
            license_hostname: '',
            license_key: '',
            license_invoice: 0,
            license_coupon: 0,
            license_extra: '',
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
        serviceExtra: [''],
        extraInfoTables: {
            ip_info: {
                title: 'IP Information',
                rows: [],
            },
        },
        serviceOverviewExtra: '',
        serviceType: {
            services_id: 0,
            services_name: '',
            services_cost: 0,
            services_category: 0,
            services_buyable: 0,
            services_type: 0,
            services_field1: '',
            services_field2: '',
            services_module: 'licenses',
        },
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
                const response = await fetchWrapper.get(baseUrl + '/licenses');
                this.licenseList = response;
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
                const response = await fetchWrapper.get(baseUrl + '/licenses/' + id);
                this.$reset();
                console.log(response);
                this.serviceInfo = response.serviceInfo;
                this.clientLinks = response.client_links;
                this.billingDetails = response.billingDetails;
                this.custCurrency = response.custCurrency;
                this.custCurrencySymbol = response.custCurrencySymbol;
                this.pkg = response.package;
                this.serviceExtra = response.serviceExtra;
                this.extraInfoTables = response.extraInfoTables;
                this.serviceOverviewExtra = response.service_overview_extra;
                this.serviceType = response.serviceType;
                //this.license_key = response.license_key;
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
            //this.licenseList.find((x) => x.license_id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.licenseList = this.licenseList.filter((x) => x.license_id !== id);
        },
    },
});

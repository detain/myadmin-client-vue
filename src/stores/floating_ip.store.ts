import { defineStore } from 'pinia';
import fetchWrapper from '@/helpers/fetchWrapper.ts';
import snakeToCamel from '@/helpers/snakeToCamel.ts';

import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '@/types/view-service-common';
import useAuthStore from '@/stores/auth.store.ts';
import useSiteStore from '@/stores/site.store.ts';


interface FloatingIpInfo {
    floating_ip_id: number;
    floating_ip_type: number;
    floating_ip_currency: string;
    floating_ip_order_date: string;
    floating_ip_custid: number;
    floating_ip_quota: string;
    floating_ip_ip: string;
    floating_ip_target_ip: string;
    floating_ip_status: string;
    floating_ip_invoice: number;
    floating_ip_coupon: number;
    floating_ip_extra: string;
    floating_ip_server_status: string;
    floating_ip_comment: string;
}

interface FloatingIpState {
    floatingIpList: FloatingIpInfo[];
    serviceInfo: FloatingIpInfo;
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
    usage_count: number;
}

export const useFloatingIpStore = defineStore({
    id: 'floating_ip',
    state: (): FloatingIpState => ({
        floatingIpList: [],
        loading: false,
        error: false,

        pkg: '',
        linkDisplay: false,
        serviceInfo: {
            floating_ip_id: 0,
            floating_ip_type: 0,
            floating_ip_currency: '',
            floating_ip_order_date: '',
            floating_ip_custid: 0,
            floating_ip_quota: '',
            floating_ip_ip: '',
            floating_ip_target_ip: '',
            floating_ip_status: '',
            floating_ip_invoice: 0,
            floating_ip_coupon: 0,
            floating_ip_extra: '',
            floating_ip_server_status: '',
            floating_ip_comment: '',
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
        serviceExtra: [],
        extraInfoTables: {
            floating_ip: {
                title: 'Connection Information',
                rows: [],
            },
            tutorials: {
                title: 'Tutorials',
                rows: [],
            },
        },
        serviceType: {
            services_id: 0,
            services_name: '',
            services_cost: 0,
            services_category: 0,
            services_buyable: 0,
            services_type: 0,
            services_field1: '',
            services_field2: '',
            services_module: 'floating_ips',
        },
        usage_count: 0,
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
                const response = await fetchWrapper.get(baseUrl + '/floating_ip');
                this.floatingIpList = response;
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
                const response = await fetchWrapper.get(baseUrl + '/floating_ip/' + id);
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
                this.serviceType = response.serviceType;
                this.usage_count = response.usage_count;
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
            //this.floatingIpList.find((x) => x.floating_ip_id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.floatingIpList = this.floatingIpList.filter((x) => x.floating_ip_id !== id);
        },
    },
});

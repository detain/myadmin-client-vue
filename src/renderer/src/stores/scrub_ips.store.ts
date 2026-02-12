import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ClientLink, ServiceType, BillingDetails, ExtraInfoTables } from '@/types/view-service-common';
import { useSiteStore } from '@/stores/site.store';

interface ScrubIpInfo {
    scrub_ip_id: number;
    scrub_ip_type: number;
    scrub_ip_currency: string;
    scrub_ip_order_date: string;
    scrub_ip_custid: number;
    scrub_ip_ip: string;
    scrub_ip_status: string;
    scrub_ip_invoice: number;
    scrub_ip_coupon: number;
    scrub_ip_extra: string;
    scrub_ip_comment: string;
    scrub_ip_service_module: string;
    scrub_ip_service_id: number;
}

interface ScrubIpState {
    scrubIpList: ScrubIpInfo[];
    serviceInfo: ScrubIpInfo;
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
    serviceStatus: string;
    statusClass: string | boolean;
}

export const useScrubIpStore = defineStore('scrub_ips', {
    state: () => ({
        scrubIpList: [],
        loading: false,
        error: false,
        pkg: '',
        linkDisplay: false,
        scrubIps: [] as any[],
        serviceInfo: {
            scrub_ip_id: 0,
            scrub_ip_type: 0,
            scrub_ip_currency: '',
            scrub_ip_order_date: '',
            scrub_ip_custid: 0,
            scrub_ip_ip: '',
            scrub_ip_status: '',
            scrub_ip_invoice: 0,
            scrub_ip_coupon: 0,
            scrub_ip_extra: '',
            scrub_ip_comment: '',
            scrub_ip_service_module: '',
            scrub_ip_service_id: 0,
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
            service_cost_info: 0.0 as number,
            service_extra: [],
            serviceStatus: '' as string,
            statusClass: '' as string | boolean,
        },
        custCurrency: 'USD',
        custCurrencySymbol: '$',
        serviceExtra: {} as any,
        extraInfoTables: {} as any,
        serviceType: {
            services_id: 0,
            services_name: '',
            services_cost: 0,
            services_category: 0,
            services_buyable: 0,
            services_type: 0,
        },
        firewallRules: [],
        filterRules: [],
    }),
    getters: {
        getScrubIps(state): any[] {
            return state.scrubIps;
        },
    },
    actions: {
        async getByID(id: number): Promise<any> {
            const baseUrl = useSiteStore().getBaseUrl();
            this.loading = true;
            this.error = false;
            try {
                const response = await fetchWrapper.get(`${baseUrl}/scrub_ips/${id}`);
                this.serviceInfo = response.serviceInfo;
                this.clientLinks = response.client_links;
                this.billingDetails = response.billingDetails;
                this.custCurrency = response.custCurrency;
                this.custCurrencySymbol = response.custCurrencySymbol;
                this.serviceExtra = response.serviceExtra;
                this.extraInfoTables = response.extraInfoTables;
                this.serviceType = response.serviceType;
                this.pkg = response.package;
                this.linkDisplay = response.linkDisplay;
                this.loading = false;
                this.firewallRules = response.filter_firewall.rules || [];
                this.filterRules = response.filter_firewall.filters || [];
                console.log('Fetched scrub IP by ID:', response);
                return response;
            } catch (error) {
                this.error = true;
                this.loading = false;
                return Promise.reject(error);
            }
        },
    },
});

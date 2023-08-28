import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '@/types';
import { useAuthStore, useSiteStore } from '@/stores';

interface ServerInfo {
    server_id: number;
    server_hostname: string;
    server_custid: number;
    server_type: number;
    server_currency: string;
    server_order_date: string;
    server_invoice: number;
    server_coupon: number;
    server_status: string;
    server_root: string;
    server_dedicated_tag: string;
    server_custom_tag: string;
    server_comment: string;
    server_initial_bill: number;
    server_hardware: number;
    server_ips: number;
    server_monthly_bill: number;
    server_setup: number;
    server_discount: string | null,
    server_rep: number;
    server_date: number;
    server_total_cost: number;
    server_location: string | null,
    server_hardware_ordered: number;
    server_billed: number;
    server_welcome_email: number;
    server_dedicated_cpu: number;
    server_dedicated_memory: number;
    server_dedicated_hd1: number;
    server_dedicated_hd2: number | null,
    server_dedicated_bandwidth: number;
    server_dedicated_ips: number;
    server_dedicated_os: number;
    server_dedicated_cp: number | null,
    server_dedicated_raid: number;
    server_extra: string;
}

interface ServerState {
    serverList: ServerInfo[];
    serviceInfo: ServerInfo;
    loading: boolean;
    error: boolean | string;
    linkDisplay: boolean | string;
    pkg: string;
    clientLinks: ClientLink[];
    billingDetails: BillingDetails;
    custCurrency: string
    custCurrencySymbol: string;
    serviceExtra: any;
    extraInfoTables: ExtraInfoTables;
    ipmiAuth: boolean;
    ipmiLease: any;
    networkInfo: {
        vlans: any;
        vlans6: any;
        assets: any;
        switchports: any;
    },
    locations: any;
}

export const useServerStore = defineStore({
    id: 'server',
    state: (): ServerState => ({
        serverList: [],
        loading: false,
        error: false,
        pkg: '',
        linkDisplay: false,
        serviceInfo: {
            server_id: 0,
            server_hostname: '',
            server_custid: 0,
            server_type: 0,
            server_currency: 'USD',
            server_order_date: '',
            server_invoice: 0,
            server_coupon: 0,
            server_status: '',
            server_root: '',
            server_dedicated_tag: '0',
            server_custom_tag: '',
            server_comment: '',
            server_initial_bill: 0,
            server_hardware: 0,
            server_ips: 0,
            server_monthly_bill: 0,
            server_setup: 0,
            server_discount: null,
            server_rep: 0,
            server_date: 0,
            server_total_cost: 0.0,
            server_location: null,
            server_hardware_ordered: 0,
            server_billed: 0,
            server_welcome_email: 0,
            server_dedicated_cpu: 0,
            server_dedicated_memory: 0,
            server_dedicated_hd1: 0,
            server_dedicated_hd2: null,
            server_dedicated_bandwidth: 0,
            server_dedicated_ips: 0,
            server_dedicated_os: 0,
            server_dedicated_cp: null,
            server_dedicated_raid: 0,
            server_extra: '[]',
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
            assets: {
                title: 'Assets',
                size: 2,
                type: 'table',
                header: ['Id', 'Hostname', 'Description', 'Location Name', 'Rack Name', 'Status', 'Primary Ipv4', 'Comments'],
                rows: [],
            },
        },
        ipmiAuth: false,
        ipmiLease: false,
        networkInfo: {
            vlans: {},
            vlans6: [],
            assets: {},
            switchports: {},
        },
        locations: {},
    }),
    getters: {

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
                const response = await fetchWrapper.get(baseUrl + '/servers');
                this.serverList = response;
            } catch (error: any) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
        async getById(id: number): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            const keyMap = {
                package: 'pkg',
            };
            try {
                const response = await fetchWrapper.get(baseUrl + '/servers/' + id);
                this.$reset();
                //let key, value;
                console.log(response);
                this.ipmiAuth = response.ipmiAuth;
                this.serviceInfo = response.serviceInfo;
                this.clientLinks = response.client_links;
                this.billingDetails = response.billingDetails;
                this.custCurrency = response.custCurrency;
                this.custCurrencySymbol = response.custCurrencySymbol;
                this.pkg = response.package;
                this.serviceExtra = response.serviceExtra;
                this.extraInfoTables = response.extraInfoTables;
                this.networkInfo = response.networkInfo;
                this.locations = response.locations;
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
            //this.serverList.find((x) => x.server_id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.serverList = this.serverList.filter((x) => x.server_id !== id);
        },
    },
});

import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

export const useServerStore = defineStore({
    id: 'server',
    state: () => ({
        serverList: [],
        loading: false,
        error: false,

        pkg: '',
        link_display: false,
        ipmiAuth: false,
        ipmiLease: false,
        serviceInfo: {
            server_id: '16058',
            server_hostname: 'mysqlcluster1.is.cc',
            server_custid: '2773',
            server_type: '600',
            server_currency: 'USD',
            server_order_date: '2020-05-08 17:22:36',
            server_invoice: '18738142',
            server_coupon: '0',
            server_status: 'active',
            server_root: 'guest',
            server_dedicated_tag: '0',
            server_custom_tag: '',
            server_comment: '1 x Six-Core E5-2620<br>64GB<br>10Tb (1Gb Port)<br>5 Vlan Ips (/29)<br>Ubuntu 20.04 Linux<br>No RAID<br>Customers IP 70.44.33.193<br>plug it into the same rack that my-mysql1 is on.  if it has room for a 2nd network card could you add a 2nd 1gb port (one for a single live ip and one to plugin to the same private switch my-mysql1 uses)',
            server_initial_bill: '0',
            server_hardware: '0',
            server_ips: '0',
            server_monthly_bill: '0',
            server_setup: '0',
            server_discount: null,
            server_rep: '0',
            server_date: '1588972956',
            server_total_cost: '230',
            server_location: null,
            server_hardware_ordered: '0',
            server_billed: '0',
            server_welcome_email: '1',
            server_dedicated_cpu: '38',
            server_dedicated_memory: '22',
            server_dedicated_hd1: '20',
            server_dedicated_hd2: null,
            server_dedicated_bandwidth: '3',
            server_dedicated_ips: '5',
            server_dedicated_os: '30',
            server_dedicated_cp: null,
            server_dedicated_raid: '0',
            server_extra: '[]',
        },
        clientLinks: [],
        billingDetails: {
            service_last_invoice_date: 'April 08, 2023',
            service_payment_status: 'Paid',
            service_frequency: 'Monthly',
            next_date: '2023-05-08 09:27:51',
            service_next_invoice_date: 'May 8, 2023',
            service_currency: 'USD',
            service_currency_symbol: '$',
            service_cost_info: '0.00',
            service_extra: [],
            service_extra_json: '[]',
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
                for (const field in response) {
                    this[field] = response[field];
                }
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
            this.serverList.find((x) => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.serverList = this.serverList.filter((x) => x.id !== id);
        },
    },
});

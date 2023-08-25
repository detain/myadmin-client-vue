import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

export const useVpsStore = defineStore({
    id: 'vps',
    state: () => ({
        vpsList: [],
        loading: false,
        error: false,

        pkg: '',
        osTemplate: '',
        serviceMaster: {},
        serviceAddons: {},
        serviceInfo: {
            vps_comment: 'my-web-2',
            vps_coupon: 3646,
            vps_currency: 'USD',
            vps_custid: 123,
            vps_diskmax: 0,
            vps_diskused: 0,
            vps_extra: '',
            vps_hostname: 'vps2578866',
            vps_id: 2578866,
            vps_invoice: 20130799,
            vps_ip: '2.3.4.5',
            vps_ipv6: null,
            vps_location: 1,
            vps_mac: '00:16:3e:27:aa:bb',
            vps_order_date: '2022-12-26 20:14:59',
            vps_os: 'ubuntu-22.04',
            vps_platform: 'kvm',
            vps_rootpass: 'myserverpass',
            vps_server: 2439,
            vps_server_status: 'running',
            vps_slices: 16,
            vps_status: 'active',
            vps_type: 33,
            vps_version: 'ubuntu',
            vps_vnc: '1.2.3.4',
            vps_vnc_port: 5902,
            vps_vzid: 'vps2578866',
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
        disk_percentage: 0,
        memory: '',
        hdd: '',
        serviceExtra: {},
        extraInfoTables: [],
        serviceType: {
            services_id: '',
            services_name: '',
            services_cost: '',
            services_category: '',
            services_ourcost: '',
            services_buyable: '',
            services_type: '',
            services_field1: '',
            services_field2: '',
            services_module: 'vps',
        },
        linkDisplay: false,
        service_disk_used: null,
        service_disk_total: null,
        daLink: 0,
        srLink: 0,
        cpLink: 0,
        ppLink: 0,
        srData: {},
        cpData: {},
        daData: {},
        plesk12Data: {},
        token: '',
        errors: false,
        vps_logs: [],
        cpuGraphData: null,
        responseText: '',
        queueId: null
    }),
    getters: {

    },
    actions: {
        async register(user) {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.post(baseUrl+'/register', user);
        },
        async getAll() {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                let response = await fetchWrapper.get(baseUrl + '/vps');
                for (const field in response) {
                    this[field] = response[field];
                }
            } catch (error) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
        async queue(id, action) {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            let success = true;
            try {
                const response = await fetchWrapper.get(baseUrl + '/vps/' + id + '/' + action);
                this.linkDisplay = response.text;
                this.responseText = response.text;
                this.queueId  = response.queueId;
            } catch (error) {
                console.log('got error response' + error);
                this.error = error;
                success = false;
            }
            this.loading = false;
            return success;
        },
        async getById(id) {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            const keyMap = {
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
                const response = await fetchWrapper.get(baseUrl + '/vps/' + id);
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
                this.osTemplate = response.os_template;
                this.serviceExtra = response.serviceExtra;
                this.extraInfoTables = response.extraInfoTables;
                this.cpuGraphData = response.cpu_graph_data;
                this.module = response.module;
                this.token = response.token;
                this.daLink = response.da_link;
                this.srLink = response.sr_link;
                this.cpData = response.cp_data;
                this.daData = response.da_data;
                this.plesk12Data = response.plesk12_data;
                this.serviceAddons = response.serviceAddons;
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
            } catch (error) {
                console.log('api failed');
                console.log(error);
            }
        },
        async update(id, params) {
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
        async delete(id) {
            // add isDeleting prop to user being deleted
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.vpsList.find((x) => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.vpsList = this.vpsList.filter((x) => x.id !== id);
        },
    },
});

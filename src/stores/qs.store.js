import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

export const useQsStore = defineStore({
    id: 'qs',
    state: () => ({
        qsList: [],
        loading: false,
        error: false,

        pkg: '',
        linkDisplay: false,
        serviceInfo: {
            qs_id: 0,
            qs_custid: 0,
            qs_server: 0,
            qs_ip: '',
            qs_ipv6: null,
            qs_vzid: '',
            qs_currency: 'USD',
            qs_type: 0,
            qs_order_date: '',
            qs_status: '',
            qs_invoice: 0,
            qs_coupon: 0,
            qs_extra: '',
            qs_hostname: '',
            qs_server_status: '',
            qs_comment: '',
            qs_slices: '0',
            qs_vnc: '',
            qs_vnc_port: null,
            qs_rootpass: '',
            qs_mac: '',
            qs_os: '',
            qs_version: '64',
            qs_location: '1',
            qs_platform: null,
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
            service_module: 'quickservers'
        },
        custCurrency: 'USD',
        custCurrencySymbol: '$',
        serviceMaster: {
            qs_id: 0,
            qs_name: '',
            qs_ip: '',
            qs_type: 0,
            qs_hdsize: 0,
            qs_hdfree: 0,
            qs_bits: 64,
            qs_load: 0.0,
            qs_ram: 0,
            qs_cpu_model: '',
            qs_cpu_mhz: 0.0,
            qs_location: 1,
            qs_available: 0,
            qs_cost: 0,
            qs_last_update: '',
            qs_cores: 0,
            qs_iowait: 0,
            qs_raid_status: '',
            qs_mounts: '',
            qs_drive_type: '',
            qs_order: 0,
            qs_raid_building: 0,
            qs_kernel: '',
            qs_ioping: 0,
            qs_speed: 1000,
            qs_distro: '',
            qs_distro_version: '',
            qs_bytes_sec_in: 0,
            qs_bytes_sec_out: 0,
            qs_packets_sec_in: 0,
            qs_packets_sec_out: 0,
            qs_last_install_time: null,
            qs_partitions: null,
            qs_cpu_flags: '',
        },
        osTemplate: '',
        serviceExtra: {
            platform: 'kvm',
            spice: 0,
        },
        extraInfoTables: {
            ip_info: {
                title: 'IP Information',
                rows: [],
            },
            addons: {
                title: 'Addons',
                rows: [],
            },
        },
        cpu_graph_data: '{"labels":[],"value":[]}',
        bandwidth_xaxis: '[]',
        bandwidth_yaxis: '[]',
        token: '%3Ftoken%',
        service_disk_used: '0.00 GB',
        service_disk_total: '0.00 GB',
        disk_percentage: 0.0,
        memory: '0GB',
        hdd: '0GB',
        serviceOverviewExtra: {
            spice_information: '',
        },
    }),
    getters: {

    },
    actions: {
        async register(user) {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll() {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                let response = await fetchWrapper.get(baseUrl + '/qs');
                for (const field in response) {
                    this[field] = response[field];
                }
            } catch (error) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
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
                const response = await fetchWrapper.get(baseUrl + '/qs/' + id);
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
                this.cpu_graph_data = response.cpu_graph_data;
                this.bandwidth_xaxis = response.bandwidth_xaxis;
                this.bandwidth_yaxis = response.bandwidth_yaxis;
                this.module = response.module;
                this.token = response.token;
                this.service_disk_used = response.service_disk_used;
                this.service_disk_total = response.service_disk_total;
                this.disk_percentage = response.disk_percentage;
                this.memory = response.memory;
                this.hdd = response.hdd;
                this.serviceOverviewExtra = response.service_overview_extra;
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
            this.qsList.find((x) => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.qsList = this.qsList.filter((x) => x.id !== id);
        },
    },
});

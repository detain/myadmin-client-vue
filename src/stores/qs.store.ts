import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { snakeToCamel } from '@/helpers/snakeToCamel.ts';

import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '@/types/view-service-common';
import { useAuthStore } from '@/stores/auth.store.ts';
import { useSiteStore } from '@/stores/site.store.ts';


interface QsInfo {
    qs_id: number;
    qs_custid: number;
    qs_server: number;
    qs_ip: string;
    qs_ipv6: string | null;
    qs_vzid: string;
    qs_currency: string;
    qs_type: number;
    qs_order_date: string;
    qs_status: string;
    qs_invoice: number;
    qs_coupon: number;
    qs_extra: string;
    qs_hostname: string;
    qs_server_status: string;
    qs_comment: string;
    qs_slices: string;
    qs_vnc: string;
    qs_vnc_port: string | null;
    qs_rootpass: string;
    qs_mac: string;
    qs_os: string;
    qs_version: string;
    qs_location: string;
    qs_platform: string | null;
}

interface QsServiceMaster {
    qs_id: number;
    qs_name: string;
    qs_ip: string;
    qs_type: number;
    qs_hdsize: number;
    qs_hdfree: number;
    qs_bits: number;
    qs_load: number;
    qs_ram: number;
    qs_cpu_model: string;
    qs_cpu_mhz: number;
    qs_location: number;
    qs_available: number;
    qs_cost: number;
    qs_last_update: string;
    qs_cores: number;
    qs_iowait: number;
    qs_raid_status: string;
    qs_mounts: string;
    qs_drive_type: string;
    qs_order: number;
    qs_raid_building: number;
    qs_kernel: string;
    qs_ioping: number;
    qs_speed: number;
    qs_distro: string;
    qs_distro_version: string;
    qs_bytes_sec_in: number;
    qs_bytes_sec_out: number;
    qs_packets_sec_in: number;
    qs_packets_sec_out: number;
    qs_last_install_time: string | null;
    qs_partitions: string | null;
    qs_cpu_flags: string;
}

interface QsState {
    qsList: QsInfo[];
    serviceInfo: QsInfo;
    serviceMaster: QsServiceMaster;
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
    osTemplate: string;
    cpu_graph_data: string;
    bandwidth_xaxis: string;
    bandwidth_yaxis: string;
    token: string;
    service_disk_used: string;
    service_disk_total: string;
    disk_percentage: number;
    memory: string;
    hdd: string;
    serviceOverviewExtra: any;
    responseText: string;
    queueId: number | null;
}

export const useQsStore = defineStore({
    id: 'qs',
    state: (): QsState => ({
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
            service_module: 'quickservers',
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
        osTemplate: '',
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
        responseText: '',
        queueId: null,
    }),
    getters: {
        titleField: (state) => state.serviceInfo.qs_hostname,
        titleField2: (state) => state.serviceInfo.qs_ip,
        titleField3: (state) => state.serviceInfo.qs_vzid
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
                this.qsList = await fetchWrapper.get(baseUrl + '/qs');
            } catch (error: any) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
        async queue(id: number | string, action: string): Promise<boolean> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            let success = true;
            try {
                const response = await fetchWrapper.get(baseUrl + '/qs/' + id + '/' + action);
                this.linkDisplay = response.text;
                this.responseText = response.text;
                this.queueId = response.queueId;
            } catch (error: any) {
                console.log('got error response' + error);
                this.error = error;
                success = false;
            }
            this.loading = false;
            return success;
        },
        async getById(id: number | string): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            const keyMap = {
                package: 'pkg',
            };
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
            //this.qsList.find((x) => x.qs_id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.qsList = this.qsList.filter((x) => x.qs_id !== id);
        },
    },
});

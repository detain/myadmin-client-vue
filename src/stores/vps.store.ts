import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '@/types/view-service-common';
import { useAuthStore, useSiteStore } from '@/stores';

interface VpsInfo {
    vps_comment      : string;
    vps_coupon       : number;
    vps_currency     : string;
    vps_custid       : number;
    vps_diskmax      : number;
    vps_diskused     : number;
    vps_extra        : string;
    vps_hostname     : string;
    vps_id           : number;
    vps_invoice      : number;
    vps_ip           : string;
    vps_ipv6         : string | null;
    vps_location     : number;
    vps_mac          : string;
    vps_order_date   : string;
    vps_os           : string;
    vps_platform     : string;
    vps_rootpass     : string;
    vps_server       : number;
    vps_server_status: string;
    vps_slices       : number;
    vps_status       : string;
    vps_type         : number;
    vps_version      : string;
    vps_vnc          : string;
    vps_vnc_port     : number;
    vps_vzid         : string;

}

interface VpsServiceMaster {
    vps_available: number;
    vps_bits: number;
    vps_cores: number;
    vps_cpu_mhz: number;
    vps_cpu_model: string;
    vps_drive_type: string;
    vps_hdfree: number;
    vps_hdsize: number;
    vps_id: number;
    vps_iowait: number;
    vps_ip: string;
    vps_kernel: string;
    vps_last_update: string;
    vps_load: number;
    vps_location: number;
    vps_mounts: string;
    vps_name: string;
    vps_order: number;
    vps_raid_building: number;
    vps_raid_status: string;
    vps_ram: number;
    vps_server_max: number;
    vps_server_max_slices: number;
    vps_type: number;
}

interface VpsServiceAddons {
    cost: number;
    cpanel_id: number;
    dedicated_ip: boolean;
    extra_ips: string[];
    extra_ips6: string[];
    has_cpanel: boolean;
    has_directadmin: boolean;
    has_fantastico: boolean;
    has_hdspace: boolean;
    has_softaculous: boolean;
    ids: string[];
    ips: string[];
    ips6: string[];
    rdata: string[];
    unpaid_ips: string[];
}

interface VpsState {
    vpsList: VpsInfo[];
    loading: boolean;
    error  : boolean | string;
    errors: boolean |  string[];
    linkDisplay: boolean | string;
    module: string;
    pkg: string;
    osTemplate: string;
    serviceInfo: VpsInfo;
    serviceMaster: VpsServiceMaster;
    serviceAddons: VpsServiceAddons;
    clientLinks: ClientLink[];
    billingDetails: BillingDetails;
    custCurrency: string
    custCurrencySymbol: string;
    disk_percentage: number;
    memory: number;
    hdd: number;
    serviceExtra: any;
    extraInfoTables: ExtraInfoTables;
    serviceType: ServiceType;
    service_disk_used: number;
    service_disk_total: number;
    daLink: number;
    srLink: number;
    cpLink: number;
    ppLink: number;
    srData: any;
    cpData: any;
    daData: any;
    plesk12Data: any;
    token: string;
    vps_logs: [];
    cpuGraphData: any;
    responseText: string;
    queueId: number | null;
}

export const useVpsStore = defineStore({
    id: 'vps',
    state: (): VpsState => ({
        vpsList: [],
        loading: false,
        error: false,
        module: 'vps',
        pkg: '',
        osTemplate: '',
        serviceMaster: {
            vps_id: 0,
            vps_name: '',
            vps_ip: '',
            vps_type: 0,
            vps_hdsize: 0,
            vps_hdfree: 0,
            vps_bits: 0,
            vps_load: 0.0,
            vps_ram: 0,
            vps_cpu_model: '',
            vps_cpu_mhz: 0,
            vps_location: 1,
            vps_last_update: '',
            vps_raid_building: 0,
            vps_kernel: '',
            vps_available: 0,
            vps_cores: 0,
            vps_iowait: 0,
            vps_raid_status: '',
            vps_mounts: '',
            vps_server_max: 0,
            vps_server_max_slices: 0,
            vps_drive_type: '',
            vps_order: 0,
        },
        serviceAddons: {
            has_cpanel: false,
            has_directadmin: false,
            has_fantastico: false,
            has_softaculous: false,
            has_hdspace: false,
            dedicated_ip: false,
            extra_ips: [],
            extra_ips6: [],
            unpaid_ips: [],
            ips: [],
            ips6: [],
            cpanel_id: 0,
            cost: 0,
            ids: [],
            rdata: []
        },
        serviceInfo: {
            vps_comment: '',
            vps_coupon: 0,
            vps_currency: 'USD',
            vps_custid: 0,
            vps_diskmax: 0,
            vps_diskused: 0,
            vps_extra: '',
            vps_hostname: '',
            vps_id: 0,
            vps_invoice: 0,
            vps_ip: '',
            vps_ipv6: null,
            vps_location: 1,
            vps_mac: '',
            vps_order_date: '',
            vps_os: '',
            vps_platform: 'kvm',
            vps_rootpass: '',
            vps_server: 0,
            vps_server_status: '',
            vps_slices: 0,
            vps_status: '',
            vps_type: 0,
            vps_version: '',
            vps_vnc: '',
            vps_vnc_port: 0,
            vps_vzid: '',
        },
        clientLinks: [],
        billingDetails: {
            service_last_invoice_date: '',
            service_payment_status: '',
            service_frequency: '',
            next_date: '',
            service_next_invoice_date: '',
            service_currency: '',
            service_currency_symbol: '',
            service_cost_info: '',
            service_extra: {},
        },
        custCurrency: 'USD',
        custCurrencySymbol: '$',
        disk_percentage: 0,
        memory: 0,
        hdd: 0,
        serviceExtra: {},
        extraInfoTables: {},
        serviceType: {
            services_id: 0,
            services_name: '',
            services_cost: 0,
            services_category: 0,
            services_buyable: false,
            services_type: 0,
            services_field1: '',
            services_field2: '',
            services_module: 'vps',
        },
        linkDisplay: false,
        service_disk_used: 0,
        service_disk_total: 0,
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
        async register(user: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.post(baseUrl+'/register', user);
        },
        async getAll(): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                const response = await fetchWrapper.get(baseUrl + '/vps');
                this.vpsList = response;
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
                const response = await fetchWrapper.get(baseUrl + '/vps/' + id + '/' + action);
                this.linkDisplay = response.text;
                this.responseText = response.text;
                this.queueId  = response.queueId;
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
            //this.vpsList.find((x) => x.vps_id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.vpsList = this.vpsList.filter((x) => x.vps_id !== id);
        },
    },
});

import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

interface ClientLink {
    label: string;
    link: string;
    icon: string;
    icon_text: string;
    help_text: string;
}

interface VpsInfo {
    vps_comment: string;
    vps_coupon: number;
    vps_currency: string;
    vps_custid: number;
    vps_diskmax: number;
    vps_diskused: number;
    vps_extra: string;
    vps_hostname: string;
    vps_id: number;
    vps_invoice: number;
    vps_ip: string;
    vps_ipv6: string | null;
    vps_location: number;
    vps_mac: string;
    vps_order_date: string;
    vps_os: string;
    vps_platform: string;
    vps_rootpass: string;
    vps_server: string;
    vps_server_status: string;
    vps_slices: number;
    vps_status: string;
    vps_type: number;
    vps_version: string;
    vps_vnc: string;
    vps_vnc_port: number;
    vps_vzid: string;

}

interface ServiceType {
    services_id: number;
    services_name: string;
    services_cost: number;
    services_category: number;
    services_buyable: boolean;
    services_type: number;
    services_field1: string;
    services_field2: string;
    services_module: string;
}

interface BillingDetails {
    service_last_invoice_date: string;
    service_payment_status: string;
    service_frequency: string;
    next_date: string;
    service_next_invoice_date: string;
    service_currency: string;
    service_currency_symbol: string;
    service_cost_info: string;
    service_extra: {
        [key: string]: any;
    };
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

interface ExtraInfoTableRow {
    desc: string;
    value: string;
}

interface ExtraInfoTables {
    [key: string]: {
        rows: ExtraInfoTableRow[];
        title: string;
    };
}

interface VpsState {
    vpsList: VpsInfo[];
    loading: boolean;
    error: boolean;
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
    linkDisplay: string | boolean;
    service_disk_used: number | null;
    service_disk_total: number | null;
    daLink: number;
    srLink: number;
    cpLink: number;
    ppLink: number;
    srData: any;
    cpData: any;
    daData: any;
    plesk12Data: any;
    token: string;
    errors: boolean;
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
        serviceMaster: {},
        serviceAddons: {},
        serviceInfo: {},
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
                for (const field in response) {
                    this[field] = response[field];
                }
            } catch (error: any) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
        async queue(id: number, action: string): Promise<boolean> {
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
        async getById(id: number): Promise<void> {
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

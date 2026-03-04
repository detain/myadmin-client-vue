import { ClientLink, ServiceType, BillingDetails, ExtraInfoTables } from '@/types/view-service-common';

export interface VpsInfo {
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
    vps_server: number;
    vps_server_status: string;
    vps_slices: number;
    vps_status: string;
    vps_type: number;
    vps_version: string;
    vps_vnc: string;
    vps_vnc_port: number;
    vps_vzid: string;
}

export interface VpsServiceMaster {
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

export interface VpsServiceAddons {
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

export interface VpsState {
    vpsList: VpsInfo[];
    loading: boolean;
    error: boolean | string;
    errors: boolean | string[];
    linkDisplay: boolean | string;
    module: string;
    pkg: string;
    osTemplate: string;
    serviceInfo: VpsInfo;
    serviceMaster: VpsServiceMaster;
    serviceAddons: VpsServiceAddons;
    clientLinks: ClientLink[];
    billingDetails: BillingDetails;
    custCurrency: string;
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

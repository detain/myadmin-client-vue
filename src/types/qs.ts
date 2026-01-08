import { ClientLink, ServiceType, BillingDetails, ExtraInfoTables } from './view-service-common';

export interface QsInfo {
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

export interface QsServiceMaster {
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

export interface QsState {
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

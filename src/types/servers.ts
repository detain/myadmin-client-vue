import { ClientLink, BillingDetails, ExtraInfoTables } from '@/types/view-service-common';

export interface ServerInfo {
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
    server_discount: string | null;
    server_rep: number;
    server_date: number;
    server_total_cost: number;
    server_location: string | null;
    server_hardware_ordered: number;
    server_billed: number;
    server_welcome_email: number;
    server_dedicated_cpu: number;
    server_dedicated_memory: number;
    server_dedicated_hd1: number;
    server_dedicated_hd2: number | null;
    server_dedicated_bandwidth: number;
    server_dedicated_ips: number;
    server_dedicated_os: number;
    server_dedicated_cp: number | null;
    server_dedicated_raid: number;
    server_extra: string;
}

export interface NetworkInfo {
    vlans: any;
    vlans6: any;
    //assets: Record<string, AssetRow>;
    assets: any;
    switchports: any;
}

export interface AssetRow {
    id: number;
    order_id: number;
    hostname: string;
    status: string;
    primary_ipv4: string;
    primary_ipv6: string;
    mac: string;
    datacenter: number;
    type_id: number;
    asset_tag: string;
    rack: string;
    row: string;
    col: string;
    unit_start: string;
    unit_end: string;
    unit_sub: number;
    ipmi_mac: string;
    ipmi_ip: string;
    ipmi_admin_username: string;
    ipmi_admin_password: string;
    ipmi_client_username: string;
    ipmi_client_password: string;
    ipmi_updated: string;
    ipmi_working: number;
    company: string;
    comments: string;
    make: string;
    model: string;
    description: string;
    customer_id: string;
    external_id: number;
    billing_status: string;
    overdue: number;
    create_timestamp: string;
    update_timestamp: string;
}

export interface ServerState {
    serverList: ServerInfo[];
    serviceInfo: ServerInfo;
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
    ipmiAuth: boolean;
    ipmiLease: any;
    networkInfo: NetworkInfo;
    locations: any;
}

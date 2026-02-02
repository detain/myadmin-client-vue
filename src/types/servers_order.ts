export interface SimpleStringObj {
    [key: string]: any;
}

export interface ServerOrderResponse {
    cpu: number;
    cpu_li: CpuLi;
    cpu_cores: CpuCores;
    config_ids: ConfigIds;
    config_li: ConfigLi;
    field_label: FieldLabel;
    form_values: FormValues;
    asset_servers: any[];
    buy_it_servers: any[];
    country: string;
    currency: string;
    currencySymbol: string;
    cust_discount: number;
    custid: number;
    display_showmore: 'yes' | 'no';
    frequency: number;
    ima: 'client' | 'admin';
    regions: any[];
    step: string;
}

export interface CpuCores {
    [key: string]: {
        [key: string]: CpuCoresRow;
    };
}

export interface ConfigIds {
    [key: string]: number;
}

export interface FormValues {
    [key: string]: number;
}

export interface FieldLabel {
    [key: string]: {
        name: string;
        active?: number;
    };
}

export interface ConfigLi extends SimpleStringObj {
    cpu_li: Record<string, CpuRow>;
    memory_li: Record<string, Record<string, MemoryRow>>;
    hd_li: Record<string, Record<string, HdRow>>;
    bandwidth_li: Record<string, BandwidthRow>;
    ips_li: Record<string, IpsRow>;
    os_li: Record<string, OsRow>;
    cp_li: Record<string, CpRow>;
    raid_li: Record<string, RaidRow>;
}

export interface CpuLi extends SimpleStringObj {
    [key: string]: CpuRow;
}

export interface MemoryLi extends SimpleStringObj {
    [key: string]: {
        [key: string]: MemoryRow;
    };
}

export interface HdLi extends SimpleStringObj {
    [key: string]: {
        [key: string]: HdRow;
    };
}

export interface BandwidthLi extends SimpleStringObj {
    [key: string]: BandwidthRow;
}

export interface IpsLi extends SimpleStringObj {
    [key: string]: IpsRow;
}

export interface OsLi extends SimpleStringObj {
    [key: string]: OsRow;
}

export interface CpLi extends SimpleStringObj {
    [key: string]: CpRow;
}

export interface RaidLi extends SimpleStringObj {
    [key: string]: RaidRow;
}

export interface CpuRow {
    active: string;
    benchmark: string;
    cache: string;
    fsb: string;
    hd_ids: string;
    id: string;
    img: string;
    location: string;
    long_desc: string;
    manu: string;
    max_lff: string;
    max_nve: string;
    max_ram: string;
    max_sff: string;
    min_ram: string;
    monthly_price: number;
    monthly_price_display: string;
    num_cores: string;
    num_cpus: string;
    price: number;
    price_display: string;
    short_desc: string;
    speed: string;
    type: string;
    visible: string;
}

export interface CpuCoresRow extends CpuRow {
    memory_det: MemoryRow;
    hd_det: HdRow;
    monthly_fee: string;
}

export interface MemoryRow {
    id: string;
    monthly_price: string;
    monthly_price_display: string;
    short_desc: string;
}

export interface HdRow {
    drive_type: string;
    hidden: string;
    id: string;
    img: string;
    long_desc: string;
    manu: string;
    monthly_price: string;
    monthly_price_display: string;
    price: string;
    short_desc: string;
    size: string;
    type: string;
}

export interface BandwidthRow {
    active: string;
    id: string;
    img: string;
    long_desc: string;
    monthly_price: string;
    monthly_price_display: string;
    price: string;
    price_display: string;
    qty: string;
    short_desc: string;
    type: string;
}

export interface IpsRow {
    id: string;
    img: string;
    long_desc: string;
    monthly_price: string;
    monthly_price_display: string;
    price: string;
    price_display: string;
    qty: string;
    short_desc: string;
}

export interface OsRow {
    active: string;
    id: string;
    img: string;
    long_desc: string;
    monthly_price: string;
    monthly_price_display: string;
    price: string;
    price_display: string;
    short_desc: string;
}

export interface CpRow {
    id: string;
    img: string;
    long_desc: string;
    monthly_price: string;
    monthly_price_display: string;
    os_type: string;
    price: string;
    price_display: string;
    short_desc: string;
    types: string;
}

export interface RaidRow {
    active: string;
    id: string;
    img: string;
    long_desc: string;
    monthly_price: string;
    monthly_price_display: string;
    price: string;
    price_display: string;
    short_desc: string;
}

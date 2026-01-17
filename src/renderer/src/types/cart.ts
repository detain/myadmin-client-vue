export interface SimpleStringObj {
    [key: string]: any;
}

export interface CartResponse {
    modules_counts: ModuleCounts;
    modules: Modules;
    currency_arr: CurrencyArr;
    invoice_days: number;
    www_type: string;
    active: string;
    recent: string;
    currency: string;
    currencySymbol: string;
    invoices: string[];
    inv_amounts_script: string;
    total_due_display: string;
    total_display: string;
    total: string;
    total_due: string;
    total_invoices: string;
    address: string;
    name: string;
    state: string;
    phone: string;
    country: string;
    zip: string;
    city: string;
    company: string;
    paymentMethods: {
        [key: string]: string;
    };
    paymentMethodsData: PaymentMethodsData;
    paymentMethodsType: {
        [key: string]: string;
    };
    prepay_invoices: string;
    displayPrepay: string;
    prepay: number;
    cont_fields: {
        name: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    pymt_method: string;
    cc_auto: number;
    payssion_min: number;
    ima: string;
    country_select: string;
    order_msg: boolean;
    invrows: InvRow[];
    cc_arr: CCRow[];
    serverInfo: ServerRow[];
    hds: HDRow[];
}

export interface ModuleCounts {
    [key: string]: number;
}

export interface Modules {
    [key: string]: ModuleSettings;
}

export interface CurrencyArr {
    [key: string]: string;
}

export interface PaymentMethodsData {
    [key: string]: {
        link_class: string;
        link_style: string;
        text: string;
        image: string;
        image_style: string;
    };
}

export interface ModuleSettings {
    BILLING_DAYS_OFFSET: number;
    DELETE_PENDING_DAYS: number;
    EMAIL_FROM: string;
    IMGNAME: string;
    MENUNAME: string;
    PREFIX: string;
    REPEAT_BILLING_METHOD: string;
    SERVICE_ID_OFFSET: number;
    SUSPEND_DAYS: number;
    SUSPEND_WARNING_DAYS: number;
    TABLE: string;
    TBLNAME: string;
    TITLE: string;
    TITLE_FIELD: string;
    TITLE_FIELD2: string;
    TITLE_FIELD3: string;
    USE_PACKAGES: boolean;
    USE_REPEAT_INVOICE: boolean;
}

export interface InvRow {
    collapse: number;
    currency_display: string;
    date: string;
    days_old: number;
    invoices_amount: number;
    invoices_currency: string;
    invoices_custid: number;
    invoices_date: string;
    invoices_deleted: number;
    invoices_description: string;
    invoices_due_date: string;
    invoices_extra: number;
    invoices_group: number;
    invoices_id: number;
    invoices_module: string;
    invoices_paid: number;
    invoices_service: number;
    invoices_type: number;
    repeat_invoices_cost: number;
    repeat_invoices_currency: string;
    repeat_invoices_custid: number;
    repeat_invoices_date: string;
    repeat_invoices_deleted: number;
    repeat_invoices_description: string;
    repeat_invoices_frequency: number;
    repeat_invoices_group: number;
    repeat_invoices_id: number;
    repeat_invoices_last_date: string;
    repeat_invoices_module: string;
    repeat_invoices_next_date: string;
    repeat_invoices_service: number;
    repeat_invoices_type: number;
    service: string;
    service_invoice: boolean;
    service_label: string;
    service_line: number;
    service_status: string;
    prepay_invoice?: number;
}

export interface CCRow {
    cc_exp: string;
    delete_text: string;
    edit_text: string;
    mask_cc: string;
    name: string;
    verified: string;
    verified_cc: string;
    verified_text: string;
}

export interface HDRow {
    drive_type: string;
    hidden: number;
    id: number;
    img: string;
    long_desc: string;
    manu: string;
    monthly_price: number;
    price: string;
    short_desc: string;
    size: number;
    type: string;
}

export interface ServerRow {
    server_billed: number;
    server_comment: string;
    server_coupon: number;
    server_currency: string;
    server_custid: number;
    server_custom_tag: string;
    server_date: number;
    server_dedicated_bandwidth: number;
    server_dedicated_cp: number;
    server_dedicated_cpu: number;
    server_dedicated_hd1: number;
    server_dedicated_hd2: number;
    server_dedicated_ips: number;
    server_dedicated_memory: number;
    server_dedicated_os: number;
    server_dedicated_raid: number;
    server_dedicated_tag: number;
    server_discount: string;
    server_extra: string;
    server_hardware: number;
    server_hardware_ordered: number;
    server_hostname: string;
    server_id: number;
    server_initial_bill: number;
    server_invoice: number;
    server_ips: number;
    server_location: number;
    server_monthly_bill: number;
    server_order_date: string;
    server_rep: number;
    server_root: string;
    server_setup: number;
    server_status: string;
    server_total_cost: number;
    server_type: number;
    server_welcome_email: number;
}

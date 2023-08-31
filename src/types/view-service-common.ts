export interface ClientLink {
    label: string;
    link: string;
    icon: string;
    icon_text: string;
    help_text: string;
    other_attr: string;
}

export interface ServiceType {
    services_id: number;
    services_name: string;
    services_cost: number;
    services_curency?: string;
    services_category: number;
    services_buyable: number | boolean;
    services_type: number;
    services_field1: string;
    services_field2: string;
    services_module: string;
    services_hidden?: boolean | number;
    services_details?: string;
}

export interface ServiceTypes {
    [key: number]: ServiceType;
}

export interface BillingDetails {
    service_last_invoice_date: string;
    service_payment_status?: string;
    service_frequency: string;
    next_date?: string;
    service_next_invoice_date?: string;
    service_currency: string;
    service_currency_symbol: string;
    service_cost_info: string;
    service_coupon?: string;
    service_module?: string;
    service_extra?:
        | string
        | {
              [key: string]: any;
          };
}

export interface ExtraInfoTableRow {
    id: number;
    desc: string;
    value: string;
}

export interface ExtraInfoTables {
    [key: string]: {
        rows: ExtraInfoTableRow[];
        title: string;
        header?: string | string[];
        size?: number;
        type?: string;
    };
}

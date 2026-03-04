import { fetchWrapper } from '@/helpers/fetchWrapper';

import { defineStore } from 'pinia';

const baseUrl = 'https://my.interserver.net/apiv2';

interface ModuleSettings {
    BILLING_DAYS_OFFSET: number;
    DELETE_PENDING_DAYS: number;
    EMAIL_FROM: string;
    IMGNAME: string;
    MENUNAME: string;
    PREFIX: string;
    REPEAT_BILLING_METHOD: number;
    SERVICE_ID_OFFSET: number;
    SUSPEND_DAYS: number;
    SUSPEND_WARNING_DAYS: number;
    TABLE: string;
    TBLNAME: string;
    TITLE: string;
    TITLE_FIELD: string;
    TITLE_FIELD2?: string;
    TITLE_FIELD3?: string;
    USE_PACKAGES: boolean;
    USE_REPEAT_INVOICE: boolean;
}

interface ServiceInfo {
    services_id: number;
    services_name: string;
    services_type: number;
    services_buyable: boolean;
    services_category: number;
    services_cost: number;
    services_currency: string;
    services_field1: string;
    services_field2: string;
    services_module: string;
}

interface ServiceType {
    st_id: number;
    st_name: string;
    st_category: number;
    st_module: string;
}

interface ServiceCategory {
    category_id: number;
    category_name: string;
    category_tag: string;
    category_module: string;
}

type BreadCrum = [string, string];

interface SiteState {
    breadcrums: BreadCrum[];
    page_heading: string;
    sidemenu: string;
    title: string;
    modules: {
        [key: string]: ModuleSettings;
    };
    services: {
        [key: string]: ServiceInfo;
    };
    serviceTypes: {
        [key: string]: ServiceType;
    };
    serviceCategories: {
        [key: string]: ServiceCategory;
    };
}

export const useSiteStore = defineStore('site', {
    state: (): SiteState => ({
        // initialize state from local storage to enable user to stay logged in
        breadcrums: [],
        page_heading: '',
        sidemenu: '',
        title: '',
        modules: {
            domains: {
                SERVICE_ID_OFFSET: 10000,
                USE_REPEAT_INVOICE: true,
                USE_PACKAGES: true,
                BILLING_DAYS_OFFSET: 45,
                IMGNAME: 'domain.png',
                REPEAT_BILLING_METHOD: 2,
                DELETE_PENDING_DAYS: 45,
                SUSPEND_DAYS: 14,
                SUSPEND_WARNING_DAYS: 7,
                TITLE: 'Domain Registrations',
                MENUNAME: 'Domains',
                EMAIL_FROM: 'support@interserver.net',
                TBLNAME: 'Domains',
                TABLE: 'domains',
                TITLE_FIELD: 'domain_hostname',
                PREFIX: 'domain',
            },
            vps: {
                SERVICE_ID_OFFSET: 0,
                USE_REPEAT_INVOICE: true,
                USE_PACKAGES: true,
                BILLING_DAYS_OFFSET: 0,
                IMGNAME: 'root-server.png',
                REPEAT_BILLING_METHOD: 2,
                DELETE_PENDING_DAYS: 45,
                SUSPEND_DAYS: 14,
                SUSPEND_WARNING_DAYS: 7,
                TITLE: 'VPS',
                MENUNAME: 'VPS',
                EMAIL_FROM: 'support@interserver.net',
                TBLNAME: 'VPS',
                TABLE: 'vps',
                TITLE_FIELD: 'vps_hostname',
                TITLE_FIELD2: 'vps_ip',
                TITLE_FIELD3: 'vps_vzid',
                PREFIX: 'vps',
            },
            backups: {
                SERVICE_ID_OFFSET: 2000,
                USE_REPEAT_INVOICE: true,
                USE_PACKAGES: true,
                BILLING_DAYS_OFFSET: 0,
                IMGNAME: 'network-drive.png',
                REPEAT_BILLING_METHOD: 2,
                DELETE_PENDING_DAYS: 45,
                SUSPEND_DAYS: 14,
                SUSPEND_WARNING_DAYS: 7,
                TITLE: 'Backup Services',
                MENUNAME: 'Storage',
                EMAIL_FROM: 'support@interserver.net',
                TBLNAME: 'Storage',
                TABLE: 'backups',
                TITLE_FIELD: 'backup_username',
                TITLE_FIELD2: 'backup_ip',
                PREFIX: 'backup',
            },
            mail: {
                SERVICE_ID_OFFSET: 11000,
                USE_REPEAT_INVOICE: true,
                USE_PACKAGES: true,
                BILLING_DAYS_OFFSET: 0,
                IMGNAME: 'e-mail.png',
                REPEAT_BILLING_METHOD: 2,
                DELETE_PENDING_DAYS: 45,
                SUSPEND_DAYS: 14,
                SUSPEND_WARNING_DAYS: 7,
                TITLE: 'Mail Services',
                MENUNAME: 'Mail',
                EMAIL_FROM: 'support@interserver.net',
                TBLNAME: 'Mail',
                TABLE: 'mail',
                TITLE_FIELD: 'mail_username',
                TITLE_FIELD2: 'mail_ip',
                PREFIX: 'mail',
            },
            licenses: {
                SERVICE_ID_OFFSET: 5000,
                USE_REPEAT_INVOICE: true,
                USE_PACKAGES: true,
                BILLING_DAYS_OFFSET: 0,
                IMGNAME: 'certificate.png',
                REPEAT_BILLING_METHOD: 1,
                DELETE_PENDING_DAYS: 45,
                SUSPEND_DAYS: 9,
                SUSPEND_WARNING_DAYS: 7,
                TITLE: 'Licensing',
                EMAIL_FROM: 'invoice@cpaneldirect.net',
                TBLNAME: 'Licenses',
                TABLE: 'licenses',
                PREFIX: 'license',
                TITLE_FIELD: 'license_ip',
                TITLE_FIELD2: 'license_key',
                TITLE_FIELD3: 'license_hostname',
                MENUNAME: 'Licensing',
            },
            ssl: {
                SERVICE_ID_OFFSET: 3000,
                USE_REPEAT_INVOICE: false,
                USE_PACKAGES: true,
                BILLING_DAYS_OFFSET: 0,
                IMGNAME: 'security-ssl.png',
                REPEAT_BILLING_METHOD: 2,
                DELETE_PENDING_DAYS: 45,
                SUSPEND_DAYS: 14,
                SUSPEND_WARNING_DAYS: 7,
                TITLE: 'SSL Certificates',
                MENUNAME: 'SSL',
                EMAIL_FROM: 'support@inssl.net',
                TBLNAME: 'SSL',
                TABLE: 'ssl_certs',
                TITLE_FIELD: 'ssl_order_id',
                PREFIX: 'ssl',
            },
            floating_ips: {
                SERVICE_ID_OFFSET: 12000,
                USE_REPEAT_INVOICE: true,
                USE_PACKAGES: true,
                BILLING_DAYS_OFFSET: 0,
                IMGNAME: 'e-mail.png',
                REPEAT_BILLING_METHOD: 2,
                DELETE_PENDING_DAYS: 45,
                SUSPEND_DAYS: 14,
                SUSPEND_WARNING_DAYS: 7,
                TITLE: 'Floating IPs',
                MENUNAME: 'Floating IPs',
                EMAIL_FROM: 'support@interserver.net',
                TBLNAME: 'Floating IPs',
                TABLE: 'floating_ips',
                TITLE_FIELD: 'floating_ip_ip',
                TITLE_FIELD2: 'floating_ip_target_ip',
                PREFIX: 'floating_ip',
            },
            webhosting: {
                SERVICE_ID_OFFSET: 1000,
                USE_REPEAT_INVOICE: true,
                USE_PACKAGES: true,
                BILLING_DAYS_OFFSET: 0,
                IMGNAME: 'website.png',
                REPEAT_BILLING_METHOD: 2,
                DELETE_PENDING_DAYS: 45,
                SUSPEND_DAYS: 14,
                SUSPEND_WARNING_DAYS: 7,
                TITLE: 'Web Hosting',
                EMAIL_FROM: 'invoice@interserver.net',
                TBLNAME: 'Websites',
                TABLE: 'websites',
                PREFIX: 'website',
                TITLE_FIELD: 'website_hostname',
                TITLE_FIELD2: 'website_username',
                TITLE_FIELD3: 'website_ip',
                MENUNAME: 'Web Hosting',
            },
            quickservers: {
                SERVICE_ID_OFFSET: 0,
                USE_REPEAT_INVOICE: true,
                USE_PACKAGES: false,
                BILLING_DAYS_OFFSET: 0,
                IMGNAME: 'server.png',
                REPEAT_BILLING_METHOD: 2,
                DELETE_PENDING_DAYS: 30,
                SUSPEND_DAYS: 14,
                SUSPEND_WARNING_DAYS: 7,
                TITLE: 'Rapid Deploy Servers',
                MENUNAME: 'Rapid Deploy Servers',
                EMAIL_FROM: 'support@interserver.net',
                TBLNAME: 'Rapid Deploy Servers',
                TABLE: 'quickservers',
                TITLE_FIELD: 'qs_hostname',
                TITLE_FIELD2: 'qs_ip',
                TITLE_FIELD3: 'qs_vzid',
                PREFIX: 'qs',
            },
            servers: {
                SERVICE_ID_OFFSET: 4000,
                USE_REPEAT_INVOICE: true,
                USE_PACKAGES: false,
                BILLING_DAYS_OFFSET: 0,
                IMGNAME: 'stack.png',
                REPEAT_BILLING_METHOD: 2,
                DELETE_PENDING_DAYS: 45,
                SUSPEND_DAYS: 14,
                SUSPEND_WARNING_DAYS: 7,
                TITLE: 'Dedicated Servers',
                MENUNAME: 'Servers',
                EMAIL_FROM: 'support@interserver.net',
                TBLNAME: 'Servers',
                TABLE: 'servers',
                TITLE_FIELD: 'server_hostname',
                PREFIX: 'server',
            },
        },
        services: {},
        serviceTypes: {},
        serviceCategories: {},
    }),
    getters: {},
    actions: {
        getBaseUrl() {
            return baseUrl;
        },
        getSettings(module: string) {
            return this.modules[module];
        },
        async checkInfoLoaded(): Promise<void> {
            if (Object.keys(this.modules).length == 0) {
                this.loadInfo();
            }
        },
        async loadInfo(): Promise<void> {
            fetchWrapper.get(`${baseUrl}/info`).then((response) => {
                this.modules = response.modules;
                this.services = response.services;
                this.serviceTypes = response.serviceTypes;
                this.serviceCategories = response.serviceCategories;
                console.log('info success', response);
            });
        },
        setBreadcrums(value: BreadCrum[]) {
            this.breadcrums = value;
        },
        addBreadcrum(key: string, value: string) {
            this.breadcrums.push([key, value]);
        },
        setPageHeading(value: string) {
            this.page_heading = value;
        },
        setTitle(value: string) {
            this.title = value;
            document.title = `${this.title} | My InterServer`;
        },
        setSideMenu(value: string) {
            this.sidemenu = value;
        },
    },
});

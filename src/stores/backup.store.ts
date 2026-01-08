import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetchWrapper';
import { snakeToCamel } from '../helpers/snakeToCamel';

import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '../types/view-service-common';
import { useAuthStore } from '../stores/auth.store';
import { useSiteStore } from '../stores/site.store';

interface BackupInfo {
    backup_id: number;
    backup_server: number;
    backup_username: string;
    backup_status: string;
    backup_type: number;
    backup_currency: string;
    backup_order_date: string;
    backup_custid: number;
    backup_quota: number;
    backup_ip: string;
    backup_invoice: number;
    backup_coupon: number;
    backup_extra: string;
    backup_server_status: string;
    backup_comment: string;
}

interface BackupServiceMaster {
    backup_id: number;
    backup_name: string;
    backup_ip: string;
    backup_type: number;
    backup_hdsize: number;
    backup_hdfree: number;
    backup_last_update: string;
    backup_available: number;
    backup_iowait: number;
    backup_order: number;
}

interface BackupState {
    backupList: BackupInfo[];
    serviceInfo: BackupInfo;
    serviceMaster: BackupServiceMaster;
    loading: boolean;
    linkDisplay: boolean | string;
    error: boolean | string;
    pkg: string;
    clientLinks: ClientLink[];
    billingDetails: BillingDetails;
    custCurrency: string;
    custCurrencySymbol: string;
    serviceExtra: any;
    extraInfoTables: ExtraInfoTables;
}

export const useBackupStore = defineStore('backup', {
    state: (): BackupState => ({
        backupList: [],
        loading: false,
        error: false,
        pkg: '',
        linkDisplay: false,
        serviceInfo: {
            backup_id: 0,
            backup_server: 0,
            backup_username: '',
            backup_type: 0,
            backup_currency: 'USD',
            backup_order_date: '',
            backup_custid: 0,
            backup_quota: 0,
            backup_ip: '',
            backup_status: '',
            backup_invoice: 0,
            backup_coupon: 0,
            backup_extra: '[]',
            backup_server_status: '',
            backup_comment: '',
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
            service_extra: [],
        },
        custCurrency: 'USD',
        custCurrencySymbol: '$',
        serviceMaster: {
            backup_id: 0,
            backup_name: '',
            backup_ip: '',
            backup_type: 0,
            backup_hdsize: 0,
            backup_hdfree: 0,
            backup_last_update: '',
            backup_available: 0,
            backup_iowait: 0.0,
            backup_order: 0,
        },
        serviceExtra: [],
        extraInfoTables: {
            ip_info: {
                title: 'IP Information',
                rows: [],
            },
        },
    }),
    getters: {
        titleField: (state) => state.serviceInfo.backup_username,
        titleField2: (state) => state.serviceInfo.backup_ip,
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
                this.backupList = await fetchWrapper.get(`${baseUrl}/backups`);
            } catch (error: any) {
                console.log(`got error response${error}`);
                this.error = error;
            }
            this.loading = false;
        },
        async getById(id: number | string): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            const keyMap = {
                package: 'pkg',
            };
            try {
                const response = await fetchWrapper.get(`${baseUrl}/backups/${id}`);
                this.$reset();
                console.log(response);
                this.serviceInfo = response.serviceInfo;
                this.clientLinks = response.client_links;
                this.billingDetails = response.billingDetails;
                this.custCurrency = response.custCurrency;
                this.custCurrencySymbol = response.custCurrencySymbol;
                this.serviceMaster = response.serviceMaster;
                this.pkg = response.package;
                this.serviceExtra = response.serviceExtra;
                this.extraInfoTables = response.extraInfoTables;
            } catch (error: any) {
                console.log('api failed');
                console.log(error);
            }
        },
        async update(id: number, params: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.put(`${baseUrl}/${id}`, params);

            // update stored user if the logged-in user updated their own record
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
            //this.backupList.find((x) => x.backup_id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.backupList = this.backupList.filter((x) => x.backup_id !== id);
        },
    },
});

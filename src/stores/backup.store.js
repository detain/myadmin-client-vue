import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

export const useBackupStore = defineStore({
    id: 'backup',
    state: () => ({
        backupList: [],
        loading: false,
        error: false,

        pkg: '',
        link_display: false,
        settings: {
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
        serviceInfo: {
            backup_id: '21163',
            backup_server: '38',
            backup_username: 'st21163',
            backup_type: '10831',
            backup_currency: 'USD',
            backup_order_date: '2021-12-29 14:09:57',
            backup_custid: '2773',
            backup_quota: '0',
            backup_ip: '64.20.55.234',
            backup_status: 'canceled',
            backup_invoice: '19591007',
            backup_coupon: '0',
            backup_extra: '[]',
            backup_server_status: 'deleted',
            backup_comment: '',
        },
        clientLinks: [
            {
                label: 'Invoices',
                link: 'view_backup?id=21163&link=invoices',
                icon: 'fas fa-file-invoice-dollar fa-w-12',
                icon_text: '',
                help_text: 'Invoice History',
            },
            {
                label: 'Cancel Storage',
                link: 'view_backup?id=21163&link=cancel',
                icon: 'fas fa-times',
                icon_text: '',
                help_text: 'Cancel Storage',
            },
            {
                label: 'Login to Storage',
                link: 'auto_storage_login?id=21163',
                icon: 'fa fa-sign-in',
                icon_text: '',
                help_text: 'Login to Storage Portal',
                other_attr: 'target="__blank"',
            },
            {
                label: 'Send Welcome Email',
                link: 'view_backup?id=21163&link=welcome_email',
                icon: 'material-icons',
                icon_text: 'send',
                help_text: 'Send welcome email',
                other_attr: '',
            },
        ],
        billingDetails: {
            service_last_invoice_date: 'December 29, 2021',
            service_payment_status: 'Paid',
            service_frequency: 'Monthly',
            next_date: '2022-01-29 14:09:57',
            service_next_invoice_date: 'January 29, 2022',
            service_currency: 'USD',
            service_currency_symbol: '$',
            service_cost_info: '3.00',
            service_extra: [],
            service_extra_json: '[]',
        },
        custCurrency: 'USD',
        custCurrencySymbol: '$',
        serviceMaster: {
            backup_id: '38',
            backup_name: 'storage1400.is.cc',
            backup_ip: '64.20.55.234',
            backup_type: '703',
            backup_hdsize: '156448',
            backup_hdfree: '33458',
            backup_last_update: '2023-04-30 09:20:02',
            backup_available: '0',
            backup_iowait: '0',
            backup_order: '21359',
            backup_key: '5ipfEd6rLI99S5jJq181419vd8j651872pHRi43R60Y02V12N4n0epeUpAND1px1',
        },
        serviceExtra: [],
        extraInfoTables: {
            ip_info: {
                title: 'IP Information',
                rows: [
                    {
                        desc: 'Netmask',
                        value: '255.255.255.248',
                    },
                    {
                        desc: 'Gateway',
                        value: '64.20.55.233',
                    },
                    {
                        desc: 'Broadcast',
                        value: '64.20.55.239',
                    },
                ],
            },
        },
        csrf: '4ae9d56076b6e5e0c2fb71d2ed518299ee41d0fa923f877f6b14a10dfac970fd4dd9f2e677e1842bf08336856f527fdaab70c25205d06c1c45d17a4d5547c313',
    }),
    actions: {
        async register(user) {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll() {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                let response = await fetchWrapper.get(baseUrl + '/backups', {});
                for (const field in response) {
                    this[field] = response[field];
                }
            } catch (error) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
        async getById(id) {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            const keyMap = {
                package: 'pkg',
            };
            /*
            this.user = { loading: true };
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.user = { error };
            }
            */
            try {
                const response = await fetchWrapper.get(baseUrl + '/backups/' + id, {});
                this.$reset();
                let key, value;
                console.log(response);
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
            } catch (error) {
                console.log('api failed');
                console.log(error);
            }
        },
        async update(id, params) {
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
        async delete(id) {
            // add isDeleting prop to user being deleted
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.backupList.find((x) => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`, {});

            // remove user from list after deleted
            this.backupList = this.backupList.filter((x) => x.id !== id);
        },
    },
});

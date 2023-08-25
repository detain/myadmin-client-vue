import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

export const useLicenseStore = defineStore({
    id: 'license',
    state: () => ({
        licenseList: [],
        loading: false,
        error: false,

        pkg: '',
        serviceInfo: {
            license_id: 0,
            license_type: 0,
            license_currency: 'USD',
            license_order_date: '2020-01-14 10:48:14',
            license_custid: 0,
            license_ip: '192.64.80.218',
            license_status: 'active',
            license_hostname: '',
            license_key: '',
            license_invoice: 0,
            license_coupon: 0,
            license_extra: '',
        },
        clientLinks: [
            {
                label: 'Invoices',
                link: 'view_license?id=386522&link=invoices',
                icon: 'fas fa-file-invoice-dollar fa-w-12',
                icon_text: '',
                help_text: 'Invoice History',
            },
            {
                label: 'Cancel Licenses',
                link: 'view_license?id=386522&link=cancel',
                icon: 'fas fa-times',
                icon_text: '',
                help_text: 'Cancel Licenses',
            },
            {
                label: 'Change IP',
                link: 'view_license?id=386522&link=change_ip',
                icon: 'fa fa-map-marker-alt',
                icon_text: '',
                help_text: 'Change License IP Address',
                other_attr: '',
            },
        ],
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
        serviceExtra: [''],
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
                        value: '192.64.80.217',
                    },
                    {
                        desc: 'Broadcast',
                        value: '192.64.80.223',
                    },
                ],
            },
        },
        serviceOverviewExtra: '',
        serviceType: {
            services_id: 0,
            services_name: '',
            services_cost: 0,
            services_category: 0,
            services_buyable: 0,
            services_type: 0,
            services_field1: '',
            services_field2: '',
            services_module: 'licenses',
        },
    }),
    getters: {

    },
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
                let response = await fetchWrapper.get(baseUrl + '/licenses');
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
                const response = await fetchWrapper.get(baseUrl + '/licenses/' + id);
                this.$reset();
                console.log(response);
                this.serviceInfo = response.serviceInfo;
                this.clientLinks = response.client_links;
                this.billingDetails = response.billingDetails;
                this.custCurrency = response.custCurrency;
                this.custCurrencySymbol = response.custCurrencySymbol;
                this.pkg = response.package;
                this.serviceExtra = response.serviceExtra;
                this.extraInfoTables = response.extraInfoTables;
                this.service_overview_extra = response.service_overview_extra;
                this.serviceType = response.serviceType;
                //this.license_key = response.license_key;
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
            this.licenseList.find((x) => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.licenseList = this.licenseList.filter((x) => x.id !== id);
        },
    },
});

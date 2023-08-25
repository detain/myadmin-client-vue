import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

export const useMailStore = defineStore({
    id: 'mail',
    state: () => ({
        mailList: [],
        loading: false,
        error: false,

        pkg: '',
        link_display: false,
        serviceInfo: {
            mail_id: 0,
            mail_username: '',
            mail_type: 0,
            mail_currency: '',
            mail_order_date: '',
            mail_custid: 0,
            mail_quota: 0,
            mail_ip: '',
            mail_status: '',
            mail_invoice: 0,
            mail_coupon: 0,
            mail_extra: '[]',
            mail_server_status: '',
            mail_comment: '',
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
        serviceExtra: [],
        extraInfoTables: {
            mail: {
                title: 'Connection Information',
                rows: [],
            },
            tutorials: {
                title: 'Tutorials',
                rows: [],
            },
        },
        serviceType: {
            services_id: 0,
            services_name: '',
            services_cost: 0,
            services_category: 0,
            services_buyable: 0,
            services_type: 0,
            services_field1: '',
            services_field2: '',
            services_module: 'mail',
        },
        usage_count: 0,
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
                let response = await fetchWrapper.get(baseUrl + '/mail');
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
                const response = await fetchWrapper.get(baseUrl + '/mail/' + id);
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
                this.serviceType = response.serviceType;
                this.usage_count = response.usage_count;
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
            this.mailList.find((x) => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.mailList = this.mailList.filter((x) => x.id !== id);
        },
    },
});

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
            mail_id: '5652',
            mail_username: 'mb5652',
            mail_type: '10880',
            mail_currency: 'INR',
            mail_order_date: '2020-09-30 16:22:29',
            mail_custid: '2773',
            mail_quota: '0',
            mail_ip: '',
            mail_status: 'expired',
            mail_invoice: '18931034',
            mail_coupon: '0',
            mail_extra: '[]',
            mail_server_status: 'running',
            mail_comment: '',
        },
        clientLinks: [],
        billingDetails: {
            service_last_invoice_date: 'April 09, 2021',
            service_payment_status: 'Unpaid',
            service_frequency: 'Monthly',
            next_date: '2021-05-09 09:21:23',
            service_next_invoice_date: 'May 9, 2021',
            service_currency: 'INR',
            service_currency_symbol: '₹',
            service_cost_info: '0.00',
            service_extra: [],
            service_extra_json: '[]',
        },
        custCurrency: 'USD',
        custCurrencySymbol: '$',
        serviceExtra: [],
        extraInfoTables: {
            mail: {
                title: 'Connection Information',
                rows: [
                    {
                        desc: 'SMTP Server',
                        value: 'relay.mailbaby.net',
                    },
                    {
                        desc: 'SMTP Port',
                        value: '25, 587, 2525 (any of these will work)',
                    },
                    {
                        desc: 'Username',
                        value: 'guest',
                    },
                    {
                        desc: 'Password',
                        value: 'guest',
                    },
                ],
            },
            tutorials: {
                title: 'Tutorials',
                rows: [
                    {
                        desc: 'cPanel Tutorial',
                        value: '<a class="link" href="https://mail.baby/cpanel/" target="_blank">Click Here</a>',
                    },
                    {
                        desc: 'DirectAdmin Tutorial',
                        value: '<a class="link" href="https://mail.baby/direct-admin/" target="_blank">Click Here</a>',
                    },
                    {
                        desc: 'Exchange Tutorial',
                        value: '<a class="link" href="https://mail.baby/exchange/" target="_blank">Click Here</a>',
                    },
                    {
                        desc: 'Plesk Tutorial',
                        value: '<a class="link" href="https://mail.baby/plesk/" target="_blank">Click Here</a>',
                    },
                ],
            },
        },
        serviceType: {
            services_id: '10880',
            services_name: 'MailBaby Mail',
            services_cost: '1.00',
            services_category: '800',
            services_ourcost: '0.00',
            services_buyable: '1',
            services_type: '800',
            services_field1: '',
            services_field2: '',
            services_module: 'mail',
        },
        usage_count: '0',
    }),
    getters: {

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
                const response = await fetchWrapper.get(baseUrl + '/mail');
                for (const field in response) {
                    this[field] = response[field];
                }
            } catch (error: any) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
        async getById(id: number): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            const keyMap = {
                package: 'pkg',
            };
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
            } catch (error: any) {
                console.log('api failed');
                console.log(error);
            }
        },
        async update(id: number, params: any): Promise<void> {
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
        async delete(id: number): Promise<void> {
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

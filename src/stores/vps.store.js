import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

export const useVpsStore = defineStore({
    id: 'vps',
    state: () => ({
        vpsList: [],
        loading: false,
        error: false,

        pkg: '',
        osTemplate: '',
        serviceMaster: {},
        serviceAddons: {},
        serviceInfo: {
            vps_id: '592337',
            vps_hostname: 'detain.dev',
            vps_username: 'detaindev',
            vps_password: '12315688fgfasghs',
            vps_type: '10673',
            vps_currency: 'USD',
            vps_expire_date: '2023-08-14 00:59:38',
            vps_order_date: '2022-08-13 20:58:58',
            vps_custid: '2773',
            vps_status: 'active',
            vps_invoice: '19917286',
            vps_coupon: '0',
            vps_firstname: 'Real',
            vps_lastname: 'Person',
            vps_email: 'realperson@mydomain.com',
            vps_address: '91 Mullberry St.',
            vps_address2: '',
            vps_address3: '',
            vps_city: 'Area 51',
            vps_state: 'PA',
            vps_zip: '00001',
            vps_country: 'US',
            vps_phone: '8675309',
            vps_fax: '',
            vps_company: 'InterServer Secaucus',
        },
        clientLinks: [],
        billingDetails: {
            service_last_invoice_date: 'August 13, 2022',
            service_payment_status: 'Paid',
            service_frequency: 'Yearly',
            next_date: '2023-08-14 00:59:38',
            service_next_invoice_date: 'August 14, 2023',
            service_currency: 'USD',
            service_currency_symbol: '$',
            service_cost_info: '18.00',
            service_extra: {},
        },
        custCurrency: 'USD',
        custCurrencySymbol: '$',
        disk_percentage: 0,
        memory: '',
        hdd: '',
        serviceExtra: {},
        extraInfoTables: [],
        serviceType: {
            services_id: '',
            services_name: '',
            services_cost: '',
            services_category: '',
            services_ourcost: '',
            services_buyable: '',
            services_type: '',
            services_field1: '',
            services_field2: '',
            services_module: 'vps',
        },
        linkDisplay: false,
        service_disk_used: null,
        service_disk_total: null,
        daLink: 0,
        srLink: 0,
        cpLink: 0,
        ppLink: 0,
        srData: {},
        cpData: {},
        daData: {},
        plesk12Data: {},
        token: '',
        errors: false,
        vps_logs: [],
        cpuGraphData: null,
        responseText: '',
        queueId: null
    }),

    actions: {
        async register(user) {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.post(baseUrl+'/register', user);
        },
        async getAll() {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                let response = await fetchWrapper.get(baseUrl + '/vps');
                for (const field in response) {
                    this[field] = response[field];
                }
            } catch (error) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
        async queue(id, action) {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            let success = true;
            try {
                const response = await fetchWrapper.get(baseUrl + '/vps/' + id + '/' + action);
                this.linkDisplay = response.text;
                this.responseText = response.text;
                this.queueId  = response.queueId;
            } catch (error) {
                console.log('got error response' + error);
                this.error = error;
                success = false;
            }
            this.loading = false;
            return success;
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
                const response = await fetchWrapper.get(baseUrl + '/vps/' + id);
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
            this.vpsList.find((x) => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.vpsList = this.vpsList.filter((x) => x.id !== id);
        },
    },
});

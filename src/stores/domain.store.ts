import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

export const useDomainStore = defineStore({
    id: 'domain',
    state: () => ({
        domainList: [],
        loading: false,
        error: false,

        pkg: '',
        link_display: false,
        serviceInfo: {
            domain_id: 592337,
            domain_hostname: 'mydomain.com',
            domain_username: 'mydomain',
            domain_password: '112233445566',
            domain_type: 10673,
            domain_expire_date: '2023-08-14 00:59:38',
            domain_order_date: '2022-08-13 20:58:58',
            domain_custid: 123545,
            domain_invoice: 19917286,
            domain_coupon: 0,
            domain_firstname: 'Real',
            domain_lastname: 'Person',
            domain_email: 'realperson@mydomain.com',
            domain_address: '91 Mullberry St.',
            domain_address2: '',
            domain_address3: '',
            domain_city: 'Area 51',
            domain_state: 'PA',
            domain_zip: '00001',
            domain_country: 'US',
            domain_phone: '8675309',
            domain_fax: '',
            domain_company: 'InterServer Secaucus'
        },
        serviceTypes: {},
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
            service_extra_json: '',
        },
        custCurrency: 'USD',
        custCurrencySymbol: '$',
        serviceExtra: {},
        extraInfoTables: [],
        serviceType: {
            services_id: '10673',
            services_name: '.dev Domain Name Registration',
            services_cost: '18.00',
            services_category: '100',
            services_ourcost: '15.00',
            services_buyable: '1',
            services_type: '100',
            services_field1: '.dev',
            services_field2: '',
            services_module: 'domains',
        },
        contact_details: {},
        pwarning: '',
        transfer_info: '',
        errors: false,
        domain_logs: [],
        allInfo: {
            _OPS_version: '0.9',
            action: 'REPLY',
            is_success: '1',
            attributes: {
                registry_expiredate: '2023-08-14 00:59:38',
                auto_renew: '0',
                registry_createdate: '2022-08-14 00:59:38',
                sponsoring_rsp: '1',
                tld_data: '',
                registry_updatedate: '2022-08-19 00:59:38',
                contact_set: {
                    tech: {},
                    owner: {},
                    admin: {},
                },
                let_expire: '0',
                gdpr_consent_status: 'PENDING',
                expiredate: '2023-08-14 00:59:38',
                nameserver_list: [
                    {
                        name: 'cdns1.interserver.net',
                        sortorder: '1',
                        ipaddress: '',
                    },
                    {
                        sortorder: '2',
                        ipaddress: '',
                        name: 'cdns2.interserver.net',
                    },
                    {
                        sortorder: '3',
                        ipaddress: '',
                        name: 'cdns3.interserver.net',
                    },
                ],
                affiliate_id: '',
            },
            response_code: '200',
            protocol: 'XCP',
            object: 'DOMAIN',
            response_text: 'Query Successful',
        },
        registrarStatus: 'Active',
        locked: 'Inactive',
        whoisPrivacy: 'disabled',
        autoRenew: 'Disabled',
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
                const response = await fetchWrapper.get(baseUrl + '/domains');
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
                const response = await fetchWrapper.get(baseUrl + '/domains/' + id);
                this.$reset();
                console.log(response);
                this.serviceInfo = response.serviceInfo;
                this.serviceTypes = response.serviceTypes;
                this.clientLinks = response.client_links;
                this.billingDetails = response.billingDetails;
                this.custCurrency = response.custCurrency;
                this.custCurrencySymbol = response.custCurrencySymbol;
                this.serviceExtra = response.serviceExtra;
                this.extraInfoTables = response.extraInfoTables;
                this.serviceType = response.serviceType;
                this.contact_details = response.contact_details;
                this.pwarning = response.pwarning;
                this.transfer_info = response.transfer_info;
                this.errors = response.errors;
                this.domain_logs = response.domain_logs;
                this.allInfo = response.allInfo;
                this.registrarStatus = response.registrarStatus;
                this.locked = response.locked;
                this.whoisPrivacy = response.whoisPrivacy;
                this.autoRenew = response.autoRenew;
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
            this.domainList.find((x) => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.domainList = this.domainList.filter((x) => x.id !== id);
        },
    },
});

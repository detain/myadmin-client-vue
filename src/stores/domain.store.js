import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();

export const useDomainStore = defineStore({
    id: 'domain',
    state: () => ({
        domainList: [],
        loading: false,
        error: false,

        pkg: '',
        link_display: false,
        settings: {
            SERVICE_ID_OFFSET: 10000,
            USE_REPEAT_INVOICE: true,
            USE_PACKAGES: true,
            BILLING_DAYS_OFFSET: 45,
            IMGNAME: "domain.png",
            REPEAT_BILLING_METHOD: 2,
            DELETE_PENDING_DAYS: 45,
            SUSPEND_DAYS: 14,
            SUSPEND_WARNING_DAYS: 7,
            TITLE: "Domain Registrations",
            MENUNAME: "Domains",
            EMAIL_FROM: "support@interserver.net",
            TBLNAME: "Domains",
            TABLE: "domains",
            TITLE_FIELD: "domain_hostname",
            PREFIX: "domain"
        },
        serviceInfo: {},
        serviceTypes: {},
        clientLinks: [],
        billingDetails: {
            service_last_invoice_date: "August 13, 2022",
            service_payment_status: "Paid",
            service_frequency: "Yearly",
            next_date: "2023-08-14 00:59:38",
            service_next_invoice_date: "August 14, 2023",
            service_currency: "USD",
            service_currency_symbol: "$",
            service_cost_info: "18.00",
            service_extra: {},
            service_extra_json: ''
        },
        custCurrency: "USD",
        custCurrencySymbol: "$",
        serviceExtra: {},
        extraInfoTables: [],
        serviceType: {
            services_id: "10673",
            services_name: ".dev Domain Name Registration",
            services_cost: "18.00",
            services_category: "100",
            services_ourcost: "15.00",
            services_buyable: "1",
            services_type: "100",
            services_field1: ".dev",
            services_field2: "",
            services_module: "domains"
        },
        csrf: "7fe6bab890ea3c81248a47f294754e89447a9c2c460501259dbbe8aa525460210116c3cd728e3543eea3c86328db5256ce52e9703166746e1e44be8fcccf28bd",
        contact_details: {},
        pwarning: "",
        transfer_info: "",
        errors: false,
        domain_logs: [],
        allInfo: {
            _OPS_version: "0.9",
            action: "REPLY",
            is_success: "1",
            attributes: {
                registry_expiredate: "2023-08-14 00:59:38",
                auto_renew: "0",
                registry_createdate: "2022-08-14 00:59:38",
                sponsoring_rsp: "1",
                tld_data: "",
                registry_updatedate: "2022-08-19 00:59:38",
                contact_set: {
                    tech: {},
                    owner: {},
                    admin: {}
                },
                let_expire: "0",
                gdpr_consent_status: "PENDING",
                expiredate: "2023-08-14 00:59:38",
                nameserver_list: [
                    {
                        name: "cdns1.interserver.net",
                        sortorder: "1",
                        ipaddress: ""
                    },
                    {
                        sortorder: "2",
                        ipaddress: "",
                        name: "cdns2.interserver.net"
                    },
                    {
                        sortorder: "3",
                        ipaddress: "",
                        name: "cdns3.interserver.net"
                    }
                ],
                affiliate_id: ""
            },
            response_code: "200",
            protocol: "XCP",
            object: "DOMAIN",
            response_text: "Query Successful"
        },
        registrarStatus: "Active",
        locked: "Inactive",
        whoisPrivacy: "disabled",
        autoRenew: "Disabled"
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll() {
            this.loading = true;
            try {
                let response = await fetchWrapper.get(baseUrl + '/domains');
                for (const field in response) {
                    this[field] = response[field];
                }
            } catch (error) {
                console.log("got error response"+error);
                this.error = error;
            }
            this.loading = false;
        },
        async getById(id) {
            const keyMap = {
                'package': 'pkg',
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
                const response = await fetchWrapper.get(baseUrl + '/domains/' + id);
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
                        console.log("no key '"+key+"' with value '"+value+"'");
                    }
                }
            } catch (error) {
                console.log('api failed');
                console.log(error);
            }


        },
        async update(id, params) {
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
            this.domainList.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.domainList = this.domainList.filter(x => x.id !== id);
        }
    }
});

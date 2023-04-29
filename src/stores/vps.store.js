import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useAuthStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/tickets`;

export const useVpsStore = defineStore({
    id: 'vps',
    state: () => ({
        loading: false,
        error: false,

        pkg: '',
        link_display: false,
        osTemplate: '',
        serviceMaster: {},
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
            TITLE_FIELD: "vps_hostname",
            PREFIX: "domain"
        },
        serviceInfo: {
            vps_id: "592337",
            vps_hostname: "detain.dev",
            vps_username: "detaindev",
            vps_password: "12315688fgfasghs",
            vps_type: "10673",
            vps_currency: "USD",
            vps_expire_date: "2023-08-14 00:59:38",
            vps_order_date: "2022-08-13 20:58:58",
            vps_custid: "2773",
            vps_status: "active",
            vps_invoice: "19917286",
            vps_coupon: "0",
            vps_firstname: "Real",
            vps_lastname: "Person",
            vps_email: "realperson@mydomain.com",
            vps_address: "91 Mullberry St.",
            vps_address2: "",
            vps_address3: "",
            vps_city: "Area 51",
            vps_state: "PA",
            vps_zip: "00001",
            vps_country: "US",
            vps_phone: "8675309",
            vps_fax: "",
            vps_company: "InterServer Secaucus",
        },
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
            service_extra: {
                order: {
                    _OPS_version: "0.9",
                    protocol: "XCP",
                    is_success: "1",
                    action: "REPLY",
                    attributes: { id: "311873405", admin_email: "realperson@mydomain.com" },
                    response_text: "Order created",
                    object: "DOMAIN",
                    response_code: "200"
                },
                order_id: "311873405",
                vps_id: "65006148",
                provProcessPending: {
                    _OPS_version: "0.9",
                    response_text: "Domain registration successfully completed.",
                    protocol: "XCP",
                    response_code: "200",
                    action: "REPLY",
                    object: "DOMAIN",
                    is_success: "1",
                    attributes: {
                        id: "65006148",
                        order_id: "311873405",
                        "registration expiration date": "2023-08-14 00:59:38",
                        f_auto_renew: "N"
                    }
                },
                email: "realperson@mydomain.com",
                firstname: "Real",
                lastname: "Person",
                company: "InterServer Secaucus",
                address: "91 Mullberry St.",
                address2: "",
                address3: "",
                city: "Area 51",
                state: "PA",
                zip: "00001",
                country: "US",
                phone: "8675309",
                fax: ""
            }
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
        service_disk_used: null,
        service_disk_total: null,
        da_link: 0,
        sr_link: 0,
        cp_link: 0,
        pp_link: 0,
        cp_data: {},
        da_data: {},
        plesk12_data: {},
        token: '',
        csrf: '',
        errors: false,
        vps_logs: [],
        cpuGraphData: null,


    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll() {
            this.loading = true;
            try {
                let response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/tickets_list');
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
            /*
            this.user = { loading: true };
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.user = { error };
            }
            */

            try {
                const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/vps/' + id);
                let key, value;
                console.log('api success');
                console.log(response);
                for (key in Object.keys(response)) {
                    value = response[key]
                    if (typeof this[key] != 'undefined') {
                        console.log("setting "+key+" to "+value);
                        this[key] = value;
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
            this.tickets.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.tickets = this.tickets.filter(x => x.id !== id);

            // auto logout if the logged in user deleted their own record
            const authStore = useAuthStore();
            if (id === authStore.user.id) {
                authStore.logout();
            }
        }
    }
});

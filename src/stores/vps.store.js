import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/vps`;

export const useVpsStore = defineStore({
    id: 'vps',
    state: () => ({
        vpsList: [],
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
            service_extra: {}
        },
        custCurrency: "USD",
        custCurrencySymbol: "$",
        disk_percentage: 0,
        memory: '',
        hdd: '',
        serviceExtra: {},
        extraInfoTables: [],
        serviceType: {
            services_id: "",
            services_name: "",
            services_cost: "",
            services_category: "",
            services_ourcost: "",
            services_buyable: "",
            services_type: "",
            services_field1: "",
            services_field2: "",
            services_module: "vps"
        },
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
        csrf: '',
        errors: false,
        vps_logs: [],
        cpuGraphData: null
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll() {
            this.loading = true;
            try {
                let response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/vps');
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
                const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/vps/' + id);
                this.$reset();
                let key, value;
                console.log('api success');
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
            this.vpsList.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.vpsList = this.vpsList.filter(x => x.id !== id);
Z        }
    }
});

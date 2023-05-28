import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore } from '@/stores';

const baseUrl = import.meta.env.VITE_API_URL;

export const useMailStore = defineStore({
    id: 'mail',
    state: () => ({
        mailList: [],
        loading: false,
        error: false,

        pkg: '',
        link_display: false,
        settings: {
            SERVICE_ID_OFFSET: 11000,
            USE_REPEAT_INVOICE: true,
            USE_PACKAGES: true,
            BILLING_DAYS_OFFSET: 0,
            IMGNAME: "e-mail.png",
            REPEAT_BILLING_METHOD: 2,
            DELETE_PENDING_DAYS: 45,
            SUSPEND_DAYS: 14,
            SUSPEND_WARNING_DAYS: 7,
            TITLE: "Mail Services",
            MENUNAME: "Mail",
            EMAIL_FROM: "support@interserver.net",
            TBLNAME: "Mail",
            TABLE: "mail",
            TITLE_FIELD: "mail_username",
            TITLE_FIELD2: "mail_ip",
            PREFIX: "mail"
        },
        serviceInfo: {
            mail_id: "5652",
            mail_username: "mb5652",
            mail_type: "10880",
            mail_currency: "INR",
            mail_order_date: "2020-09-30 16:22:29",
            mail_custid: "2773",
            mail_quota: "0",
            mail_ip: "",
            mail_status: "expired",
            mail_invoice: "18931034",
            mail_coupon: "0",
            mail_extra: "[]",
            mail_server_status: "running",
            mail_comment: ""
        },
        clientLinks: [],
        billingDetails: {
            service_last_invoice_date: "April 09, 2021",
            service_payment_status: "Unpaid",
            service_frequency: "Monthly",
            next_date: "2021-05-09 09:21:23",
            service_next_invoice_date: "May 9, 2021",
            service_currency: "INR",
            service_currency_symbol: "₹",
            service_cost_info: "0.00",
            service_extra: [],
            service_extra_json: "[]"
        },
        custCurrency: "USD",
        custCurrencySymbol: "$",
        serviceExtra: [],
        extraInfoTables: {
            mail: {
                title: "Connection Information",
                rows: [
                    {
                        desc: "SMTP Server",
                        value: "relay.mailbaby.net"
                    },
                    {
                        desc: "SMTP Port",
                        value: "25, 587, 2525 (any of these will work)"
                    },
                    {
                        desc: "Username",
                        value: "guest"
                    },
                    {
                        desc: "Password",
                        value: "guest"
                    }
                ]
            },
            tutorials: {
                title: "Tutorials",
                rows: [
                    {
                        desc: "cPanel Tutorial",
                        value:
                            '<a class="link" href="https://mail.baby/cpanel/" target="_blank">Click Here</a>'
                    },
                    {
                        desc: "DirectAdmin Tutorial",
                        value:
                            '<a class="link" href="https://mail.baby/direct-admin/" target="_blank">Click Here</a>'
                    },
                    {
                        desc: "Exchange Tutorial",
                        value:
                            '<a class="link" href="https://mail.baby/exchange/" target="_blank">Click Here</a>'
                    },
                    {
                        desc: "Plesk Tutorial",
                        value:
                            '<a class="link" href="https://mail.baby/plesk/" target="_blank">Click Here</a>'
                    }
                ]
            }
        },
        serviceType: {
            services_id: "10880",
            services_name: "MailBaby Mail",
            services_cost: "1.00",
            services_category: "800",
            services_ourcost: "0.00",
            services_buyable: "1",
            services_type: "800",
            services_field1: "",
            services_field2: "",
            services_module: "mail"
        },
        usage_count: "0",
        csrf: ""
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll() {
            this.loading = true;
            try {
                let response = await fetchWrapper.get(baseUrl + '/mail');
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
                const response = await fetchWrapper.get(baseUrl + '/mail/' + id);
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
            this.mailList.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.mailList = this.mailList.filter(x => x.id !== id);
        }
    }
});

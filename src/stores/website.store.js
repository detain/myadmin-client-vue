import { defineStore } from 'pinia';
import { fetchWrapper, snakeToCamel } from '@/helpers';
import { useAuthStore } from '@/stores';

const baseUrl = import.meta.env.VITE_API_URL;

export const useWebsiteStore = defineStore({
    id: 'website',
    state: () => ({
        websiteList: [],
        loading: false,
        error: false,

        pkg: '',
        link_display: false,
        settings: {
            SERVICE_ID_OFFSET: 1000,
            USE_REPEAT_INVOICE: true,
            USE_PACKAGES: true,
            BILLING_DAYS_OFFSET: 0,
            IMGNAME: "website.png",
            REPEAT_BILLING_METHOD: 2,
            DELETE_PENDING_DAYS: 45,
            SUSPEND_DAYS: 14,
            SUSPEND_WARNING_DAYS: 7,
            TITLE: "Web Hosting",
            EMAIL_FROM: "invoice@interserver.net",
            TBLNAME: "Websites",
            TABLE: "websites",
            PREFIX: "website",
            TITLE_FIELD: "website_hostname",
            TITLE_FIELD2: "website_username",
            TITLE_FIELD3: "website_ip",
            MENUNAME: "Web Hosting"
        },
        serviceInfo: {
            website_id: "1196829",
            website_server: "543",
            website_type: "11363",
            website_currency: "USD",
            website_order_date: "2023-03-16 22:51:54",
            website_custid: "2773",
            website_ip: "74.50.80.15",
            website_status: "active",
            website_invoice: "20261994",
            website_coupon: "1690",
            website_extra: "[]",
            website_hostname: "vintagevultures.com",
            website_comment: "",
            website_username: "vintagev",
            website_server_status: ""
        },
        clientLinks: [
            {
                label: "Invoices",
                link: "view_website?id=1196829&link=invoices",
                icon: "fas fa-file-invoice-dollar fa-w-12",
                icon_text: "",
                help_text: "Invoice History"
            },
            {
                label: "Cancel Websites",
                link: "view_website?id=1196829&link=cancel",
                icon: "fas fa-times",
                icon_text: "",
                help_text: "Cancel Websites"
            },
            {
                label: "Send Welcome Email",
                link: "view_website?id=1196829&link=welcome_email",
                icon: "material-icons",
                icon_text: "send",
                help_text: "Resend Welcome Email",
                other_attr: ""
            },
            {
                label: "Login to DirectAdmin",
                link: "auto_directadmin_login?id=1196829",
                icon: "fa fa-sign-in",
                icon_text: "",
                help_text: "Login to DirectAdmin",
                other_attr: 'target="__blank"'
            },
            {
                label: "Download Backups",
                link: "view_website?id=1196829&link=download_backups",
                icon: "material-icons",
                icon_text: "cloud_download",
                help_text: "Download Backups",
                other_attr: ""
            },
            {
                label: "Migrate Website",
                link: "view_website?id=1196829&link=migration",
                icon: "material-icons",
                icon_text: "transfer_within_a_station",
                help_text: "Website Migration Request",
                other_attr: ""
            },
            {
                label: "Buy matching domain",
                link: "view_website?id=1196829&link=order_domain",
                icon: "fa fa-globe",
                icon_text: "",
                help_text: "Order Matching Domain",
                other_attr: ""
            }
        ],
        billingDetails: {
            service_last_invoice_date: "April 16, 2023",
            service_payment_status: "Paid",
            service_frequency: "Monthly",
            next_date: "2023-05-16 09:46:57",
            service_next_invoice_date: "May 16, 2023",
            service_currency: "USD",
            service_currency_symbol: "$",
            service_coupon: "WORKWEBSITES",
            service_cost_info: "0.00",
            service_extra: [],
            service_extra_json: "[]"
        },
        custCurrency: "USD",
        custCurrencySymbol: "$",
        serviceMaster: {
            website_id: "543",
            website_name: "vda4200.is.cc",
            website_ip: "74.50.80.15",
            website_key: "guest",
            website_type: "206",
            website_available: "1",
            website_hdsize: "2062",
            website_hdfree: "1012",
            website_load: "10.85",
            website_last_update: "2023-04-30 09:01:03",
            website_max_sites: "300",
            website_order: "58984",
            website_partitions: null,
            website_dns1: "vda4200a.trouble-free.net",
            website_dns2: "vda4200b.trouble-free.net"
        },
        serviceExtra: [],
        extraInfoTables: {
            links: {
                title: "External Links",
                rows: []
            },
            preview: {
                title: "Website Preview",
                rows: [
                    {
                        desc: "Website Preview",
                        value: "https://wh1196829.ispot.cc"
                    }
                ]
            },
            dns: {
                title: "Default DNS Servers",
                rows: [
                    {
                        desc: "vda4200a.trouble-free.net",
                        value: "74.50.80.15"
                    },
                    {
                        desc: "vda4200b.trouble-free.net",
                        value: "74.50.80.15"
                    }
                ]
            }
        },
        csrf: "e17ff0a12111c2cf2d22272a9fbdddd64f164b48276a5bdd5f95338403ebc23578aa2d48563e27d88fab60d1580834eb201e9bcbf2afd4d0be1f0d2c7ae17257"
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async getAll() {
            this.loading = true;
            try {
                let response = await fetchWrapper.get(baseUrl + '/websites');
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
                const response = await fetchWrapper.get(baseUrl + '/websites/' + id);
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
            this.websiteList.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.websiteList = this.websiteList.filter(x => x.id !== id);
Z        }
    }
});

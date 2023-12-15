import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { snakeToCamel } from '@/helpers/snakeToCamel.ts';

import { useAuthStore } from '@/stores/auth.store.ts';
import { useSiteStore } from '@/stores/site.store.ts';


interface SslListRow {
    ssl_id: number;
    ssl_hostname: string;
    services_name: string;
    ssl_status: string;
    ssl_company: string;
}

interface SslState {
    sslList: SslListRow[];
    loading: boolean;
    error: boolean;
    pkg: number;
    ssl_id: number;
    ssl_hostname: string;
    ssl_order_id: number;
    ssl_type: number;
    ssl_currency: string;
    ssl_order_date: string;
    ssl_custid: number;
    ssl_status: string;
    ssl_invoice: number;
    ssl_coupon: number;
    ssl_firstname: string;
    ssl_lastname: string;
    ssl_phone: string;
    ssl_email: string;
    ssl_company: string;
    ssl_address: string;
    ssl_city: string;
    ssl_state: string;
    ssl_zip: string;
    ssl_country: string;
    ssl_department: string;
    ssl_extra: string;
    ssl_approver_email: string;
    ssl_csr: string;
    ssl_private_key: string;
    ssl_x509: string;
    ssl_ca_root: string;
    ssl_ca_inter: string;
    linkDisplay: boolean;
}

export const useSslStore = defineStore({
    id: 'ssl',
    state: (): SslState => ({
        sslList: [],
        loading: false,
        error: false,
        ssl_id: 0,
        ssl_hostname: '',
        ssl_order_id: 0,
        ssl_type: 0,
        ssl_currency: '',
        ssl_order_date: '',
        ssl_custid: 0,
        ssl_status: '',
        ssl_invoice: 0,
        ssl_coupon: 0,
        ssl_firstname: '',
        ssl_lastname: '',
        ssl_phone: '',
        ssl_email: '',
        ssl_company: '',
        ssl_address: '',
        ssl_city: '',
        ssl_state: '',
        ssl_zip: '',
        ssl_country: '',
        ssl_department: '',
        ssl_extra: '',
        ssl_approver_email: '',
        ssl_csr: '',
        ssl_private_key: '',
        ssl_x509: '',
        ssl_ca_root: '',
        ssl_ca_inter: '',
        pkg: 0,
        linkDisplay: false,
    }),
    getters: {
        titleField: (state) => state.ssl_order_id
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
                const response = await fetchWrapper.get(baseUrl + '/ssl');
                this.sslList = response;
            } catch (error: any) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
        async getById(id: number | string): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            const keyMap = {
                package: 'pkg',
            };
            /*
            this.user = { loading: true };
            try {
                this.user = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error: any) {
                this.user = { error };
            }
            */
            try {
                const response = await fetchWrapper.get(baseUrl + '/ssl/' + id);
                this.$reset();
                this.ssl_id = response.ssl_id;
                this.ssl_hostname = response.ssl_hostname;
                this.ssl_order_id = response.ssl_order_id;
                this.ssl_type = response.ssl_type;
                this.ssl_currency = response.ssl_currency;
                this.ssl_order_date = response.ssl_order_date;
                this.ssl_custid = response.ssl_custid;
                this.ssl_status = response.ssl_status;
                this.ssl_invoice = response.ssl_invoice;
                this.ssl_coupon = response.ssl_coupon;
                this.ssl_firstname = response.ssl_firstname;
                this.ssl_lastname = response.ssl_lastname;
                this.ssl_phone = response.ssl_phone;
                this.ssl_email = response.ssl_email;
                this.ssl_company = response.ssl_company;
                this.ssl_address = response.ssl_address;
                this.ssl_city = response.ssl_city;
                this.ssl_state = response.ssl_state;
                this.ssl_zip = response.ssl_zip;
                this.ssl_country = response.ssl_country;
                this.ssl_department = response.ssl_department;
                this.ssl_extra = response.ssl_extra;
                this.ssl_approver_email = response.ssl_approver_email;
                this.ssl_csr = response.ssl_csr;
                this.ssl_private_key = response.ssl_private_key;
                this.ssl_x509 = response.ssl_x509;
                this.ssl_ca_root = response.ssl_ca_root;
                this.ssl_ca_inter = response.ssl_ca_inter;
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
            //this.sslList.find((x) => x.ssl_id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.sslList = this.sslList.filter((x) => x.ssl_id !== id);
        },
    },
});

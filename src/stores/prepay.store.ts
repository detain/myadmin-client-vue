import { defineStore } from 'pinia';
import fetchWrapper from '@/helpers/fetchWrapper.ts';
import snakeToCamel from '@/helpers/snakeToCamel.ts';

import useAuthStore from '@/stores/auth.store.ts';
import useSiteStore from '@/stores/site.store.ts';


interface PrePayRow {
    prepay_amount: number;
    prepay_automatic_use: number;
    prepay_created: string;
    prepay_currency: string;
    prepay_custid: number;
    prepay_date: string;
    prepay_deleted: number;
    prepay_id: number;
    prepay_module: string;
    prepay_remaining: number;
    prepay_remaining_disp: string;
    prepay_service: number;
    prepay_status: string;
    prepay_type: number;
}

interface PrePayHistoryRow {
    amt_used: string;
    desc: string;
    history_creator: number;
    history_id: number;
    history_new_value: number;
    history_old_value: number;
    history_owner: number;
    history_section: number;
    history_sid: string;
    history_timestamp: string;
    history_timestamp_disp: string;
    history_type: number;
}

interface PrePayState {
    loading: boolean;
    error: boolean;
    modules: {
        [key: string]: string;
    };
    ima: string;
    custid: number;
    prepays: {
        [key: number]: {
            history: PrePayHistoryRow[];
            prepay: PrePayRow;
        };
    };
    total_pages: number;
    total_records: number;
    limit: number;
    page: number;
    curr_page_records: number;
    allInfo: {
        [key: string]: {
            module_name: string;
            services: {
                [key: number]: string;
            };
        };
    };
}

export const usePrePayStore = defineStore({
    id: 'prepay',
    state: (): PrePayState => ({
        loading: false,
        error: false,
        custid: 0,
        ima: 'client',
        modules: {},
        prepays: {},
        total_pages: 0,
        total_records: 0,
        limit: 10,
        page: 1,
        curr_page_records: 0,
        allInfo: {},
    }),
    getters: {},
    actions: {
        async register(user: any): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            await fetchWrapper.post(`${baseUrl}/register`, user);
        },
        async load(): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            const keyMap = {
                package: 'pkg',
            };
            try {
                const response = await fetchWrapper.get(baseUrl + '/billing/prepays');
                this.$reset();
                let key, value;
                console.log(response);
                this.error = response.error;
                this.custid = response.custid;
                this.ima = response.ima;
                this.modules = response.modules;
                this.prepays = response.prepays;
                this.total_pages = response.total_pages;
                this.total_records = response.total_records;
                this.limit = response.limit;
                this.page = response.page;
                this.curr_page_records = response.curr_page_records;
                this.allInfo = response.allInfo;
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
            //this.accountList.find((x) => x.prepay_id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            //this.accountList = this.accountList.filter((x) => x.prepay_id !== id);
        },
    },
});

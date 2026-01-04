import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetchWrapper';

import { useAuthStore } from '../stores/auth.store';
import { useSiteStore } from '../stores/site.store';

interface InvoiceRow {
    id: number;
    module: string;
    date: string;
    service: string;
    description: string;
    amount: string;
    paid: string;
    payment_type: string;
    month: string;
    year: string;
    payment_description: string;
    paid_on: string;
}

interface InvoicesState {
    loading: boolean;
    error: boolean | string;
    custid: number;
    sortcol: number;
    sortdir: number;
    size: number;
    years_arr: {
        [key: number]: number;
    };
    months_arr: string[];
    textextraction: string;
    table_header: string[];
    sizes: string;
    table_rows: InvoiceRow[];
    rows: InvoiceRow[];
    month: number;
    year: number;
}

export const useInvoicesStore = defineStore({
    id: 'invoices',
    state: (): InvoicesState => ({
        custid: 0,
        months_arr: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        years_arr: [],
        month: 0,
        year: 0,
        sortcol: 0,
        sortdir: 1,
        textextraction: '"complex"',
        size: 100,
        sizes: '10,25,50,75,100,200,500,750,1000',
        table_header: [],
        table_rows: [],
        rows: [],
        loading: false,
        error: false,
    }),
    getters: {},
    actions: {
        async getAll(): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                const response = await fetchWrapper.get(baseUrl+'/invoices');
                this.custid = response.custid;
                this.years_arr = response.years_arr;
                this.months_arr = response.months_arr;
                this.sortcol = response.sortcol;
                this.sortdir = response.sortdir;
                this.textextraction = response.textextraction;
                this.table_header = response.table_header;
                this.size = response.size;
                this.sizes = response.sizes;
                this.table_rows = response.table_rows;
                this.rows = response.rows;
            } catch (error: any) {
                console.log('got error response'+error);
                this.error = error;
            }
            this.loading = false;
        },
    },
});

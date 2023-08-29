import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useAuthStore, useSiteStore } from '@/stores';

interface TicketRow {
    title: string;
    ticketmaskid: string;
    lastreplier: string;
    status: string;
    priority: string;
    total_replies: number;
    lastactivity: string;
    departmenttitle: string;
    ticketid: number;
    can_close: string;
    attachments: any;
    status_text: string;
    checked: boolean;
}

interface TicketState {
    loading: boolean;
    error: boolean | string;
    tickets: TicketRow[];
    ima: string;
    custid: number;
    view: string;
    currentPage: number;
    limit: number;
    sortcol: number;
    sortdir: number;
    rowsOffset: number;
    pages: number;
    rowsTotal: number;
    inboxCount: number;
    countArray: {
        Open: number;
        Closed: number;
        'On Hold': number;
    }
    viewText: string;
    search: string;
}

export const useTicketsStore = defineStore({
    id: 'tickets',
    state: (): TicketState => ({
        tickets: [],
        loading: false,
        error: false,
        ima: 'client',
        custid: 0,
        sortcol: 6,
        sortdir: 1,
        countArray: {
            Open: 0,
            'On Hold': 0,
            Closed: 0,
        },
        inboxCount: 0,
        rowsOffset: 0,
        rowsTotal: 0,
        limit: 50,
        currentPage: 1,
        pages: 1,
        view: 'Open',
        viewText: 'Inbox',
        search: '',
    }),
    getters: {

    },
    actions: {
        async getAll(): Promise<void> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            this.loading = true;
            try {
                const response = await fetchWrapper.get(baseUrl + '/tickets');
                for (const field in response) {
                    this[field] = response[field];
                }
            } catch (error: any) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
    },
});

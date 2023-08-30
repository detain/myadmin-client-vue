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
                this.ima = response.ima;
                this.custid = response.custid;
                this.view = response.view;
                this.currentPage = response.currentPage;
                this.limit = response.limit;
                this.sortcol = response.sortcol;
                this.sortdir = response.sortdir;
                this.rowsOffset = response.rowsOffset;
                this.tickets = response.tickets;
                this.pages = response.pages;
                this.rowsTotal = response.rowsTotal;
                this.inboxCount = response.inboxCount;
                this.countArray = response.countArray;
                this.viewText = response.viewText;
            } catch (error: any) {
                console.log('got error response' + error);
                this.error = error;
            }
            this.loading = false;
        },
    },
});

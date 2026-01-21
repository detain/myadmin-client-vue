import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useSiteStore } from '@/stores/site.store';

/* ======================
   Types
====================== */

export interface TicketRow {
    ticketid: number;
    ticketmaskid: string;
    title: string;
    subject: string;
    lastreplier: string;
    status: string;
    status_text: string;
    priority: string;
    department: string;
    departmenttitle: string;
    total_replies: number;
    lastactivity: string;
    can_close: string;
    attachments: any[];
    ticket_posts: any[];
    checked: boolean;
}

export interface TicketCounts {
    Open: number;
    'On Hold': number;
    Closed: number;
}

export interface TicketFetchParams {
    view?: string;
    page?: number;
    limit?: number;
    period?: string;
    search?: string;
    sortcol?: number;
    sortdir?: number;
}

/* ======================
   State
====================== */

interface TicketState {
    loading: boolean;
    error: string | false;

    tickets: TicketRow[];
    ticket: TicketRow | null;

    ima: string;
    custid: number;

    view: string;
    viewText: string;

    currentPage: number;
    limit: number;
    pages: number;
    rowsOffset: number;
    rowsTotal: number;

    sortcol: number;
    sortdir: number;

    search: string;
    period: string;

    inboxCount: number;
    countArray: TicketCounts;
}

/* ======================
   Store
====================== */

export const useTicketsStore = defineStore('tickets', {
    state: (): TicketState => ({
        loading: false,
        error: false,

        tickets: [],
        ticket: null,

        ima: 'client',
        custid: 0,

        view: 'all',
        viewText: 'All Tickets',

        currentPage: 1,
        limit: 50,
        pages: 1,
        rowsOffset: 0,
        rowsTotal: 0,

        sortcol: 6,
        sortdir: 1,

        search: '',
        period: '30',

        inboxCount: 0,
        countArray: {
            Open: 0,
            'On Hold': 0,
            Closed: 0,
        },
    }),

    getters: {
        hasTickets: (state) => state.tickets.length > 0,

        allChecked: (state) => state.tickets.length > 0 && state.tickets.every((t) => t.checked),
    },

    actions: {
        /* ======================
           Core Fetch
        ====================== */

        async fetchTickets(params: TicketFetchParams = {}) {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();

            this.loading = true;
            this.error = false;

            try {
                const query = {
                    view: params.view ?? this.view,
                    page: params.page ?? this.currentPage,
                    limit: params.limit ?? this.limit,
                    period: params.period ?? this.period,
                    search: params.search ?? this.search,
                    sortcol: params.sortcol ?? this.sortcol,
                    sortdir: params.sortdir ?? this.sortdir,
                };
                const qs = '?' + new URLSearchParams(Object.entries(query).filter(([_, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => [k, String(v)])).toString()
                const response = await fetchWrapper.get(`${baseUrl}/tickets${qs}`);

                /* ---- server response mapping ---- */

                this.ima = response.ima;
                this.custid = response.custid;

                this.view = response.view ?? query.view;
                this.viewText = response.viewText ?? this.view;

                this.currentPage = response.currentPage ?? query.page;
                this.limit = response.limit ?? query.limit;
                this.pages = response.pages ?? 1;

                this.rowsOffset = response.rowsOffset ?? 0;
                this.rowsTotal = response.rowsTotal ?? 0;

                this.sortcol = response.sortcol ?? this.sortcol;
                this.sortdir = response.sortdir ?? this.sortdir;

                this.search = query.search ?? '';
                this.period = query.period ?? '30';

                this.inboxCount = response.inboxCount ?? 0;
                this.countArray = response.countArray ?? this.countArray;

                this.tickets = (response.tickets ?? []).map((t: TicketRow) => ({
                    ...t,
                    checked: false,
                }));
            } catch (err: any) {
                console.error('Ticket fetch failed:', err);
                this.error = err?.message ?? 'Failed to load tickets';
            } finally {
                this.loading = false;
            }
        },

        /* ======================
           Search Widget
        ====================== */

        async searchTickets(keyword: string): Promise<string> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();

            try {
                const response = await fetchWrapper.post(`${baseUrl}/ajax.php?choice=tickets_search_widget`, { keyword });

                return response;
            } catch (err) {
                console.error('Search failed', err);
                return '<div class="text-danger p-2">Search failed</div>';
            }
        },

        /* ======================
           Checkbox Helpers
        ====================== */

        toggleAll(checked: boolean) {
            this.tickets.forEach((t) => (t.checked = checked));
        },

        clearChecks() {
            this.tickets.forEach((t) => (t.checked = false));
        },

        /* ======================
           Pagination Helpers
        ====================== */

        nextPage() {
            if (this.currentPage < this.pages) {
                this.fetchTickets({ page: this.currentPage + 1 });
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.fetchTickets({ page: this.currentPage - 1 });
            }
        },
    },
});

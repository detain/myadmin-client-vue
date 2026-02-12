import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useSiteStore } from '@/site.store';

/* ======================
   Types
====================== */

export interface Ticket {
    ticketid: string;
    ticketmaskid: string;

    departmentid: string;
    departmenttitle: string;

    ticketstatusid: string;
    ticketstatustitle: 'Open' | 'On Hold' | 'Closed' | string;

    priorityid: string;
    prioritytitle: string;

    emailqueueid: string;

    userid: string;
    staffid: string;
    ownerstaffid: string;
    ownerstaffname: string;

    assignstatus: string;

    fullname: string;
    email: string;
    lastreplier: string;
    replyto: string;
    subject: string;

    dateline: string;
    lastactivity: string;
    laststaffreplytime: string;
    lastuserreplytime: string;
    lastactivity_time?: string;

    slaplanid: string;
    ticketslaplanid: string;
    duetime: string;

    totalreplies: string;
    ipaddress: string;

    flagtype: string;
    hasnotes: string;
    hasattachments: string;
    isemailed: string;

    edited: string;
    editedbystaffid: string;
    editeddateline: string;

    creator: string;

    charset: string;
    transferencoding: string;

    timeworked: string;
    timebilled: string;

    dateicon: string;

    lastpostid: string;
    firstpostid: string;

    tgroupid: string;
    messageid: string;

    escalationruleid: string;

    hasdraft: string;
    hasbilling: string;

    isphonecall: string;
    isescalated: string;
    isescalatedvolatile: string;

    phoneno: string;

    isautoclosed: string;
    autocloseruleid: string;
    autoclosestatus: string;
    autoclosetimeline: string;

    escalatedtime: string;

    followupcount: string;
    hasfollowup: string;
    hasratings: string;

    tickethash: string;
    islinked: string;
    trasholddepartmentid: string;

    tickettype: string;
    tickettypeid: string;
    tickettypetitle: string;

    creationmode: string;

    isfirstcontactresolved: string;
    wasreopened: string;
    reopendateline: string;
    resolutiondateline: string;

    escalationlevelcount: string;
    resolutionseconds: string;
    resolutionlevel: string;
    repliestoresolution: string;

    averageresponsetime: string;
    averageresponsetimehits: string;
    firstresponsetime: string;

    resolutionduedateline: string;

    isresolved: string;
    iswatched: string;

    oldeditemailaddress: string;

    linkkbarticleid: string;
    linkticketmacroid: string;

    bayescategoryid: string;
    recurrencefromticketid: string;
    averageslaresponsetime: string;

    service_id: string | null;
    service_module: string | null;

    checked: boolean;
}

export interface TicketStatusCount {
    ticketstatustitle: string;
    st_count: number;
}

export type TicketStatusCounts = TicketStatusCount[];

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

    tickets: Ticket[];
    ticket: Ticket | null;

    ima: string;
    custid: number;

    view: string;
    viewText: string;

    currentPage: number;
    limit: number;
    pages: number;
    offset: number;
    totalTickets: number;

    sortcol: number;
    sortdir: number;

    search: string;
    period: string;

    st_count: TicketStatusCounts;
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
        offset: 0,
        totalTickets: 0,

        sortcol: 6,
        sortdir: 1,

        search: '',
        period: '30',
        st_count: [
            { ticketstatustitle: 'Open', st_count: 0 },
            { ticketstatustitle: 'On Hold', st_count: 0 },
            { ticketstatustitle: 'Closed', st_count: 0 },
        ],
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
                const qs = new URLSearchParams(
                    Object.entries(query)
                        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
                        .map(([k, v]) => [k, String(v)])
                ).toString();
                const response = await fetchWrapper.get(`${baseUrl}/tickets?${qs}`);

                /* ---- server response mapping ---- */

                this.ima = response.ima;
                this.custid = response.custid;
                this.view = response.view ?? query.view;
                this.period = response.selected_period ?? 30;
                this.currentPage = response.currentPage ?? query.page;
                this.limit = response.limit ?? query.limit;
                this.pages = response.pages ?? 1;
                this.offset = response.offset ?? 0;
                this.totalTickets = response.total.tickets ?? 0;

                this.search = query.search ?? '';
                this.st_count = response.st_count ?? this.st_count;

                this.tickets = (response.tickets ?? []).map((t: Ticket) => ({
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

        async searchTickets(keyword: string): Promise<Ticket[]> {
            const siteStore = useSiteStore();
            const baseUrl = siteStore.getBaseUrl();
            let results: Ticket[] = [];
            try {
                results = await fetchWrapper.post(`${baseUrl}/tickets`, { search: keyword });
                console.log(results);
            } catch (err) {
                console.error('Search failed', err);
            }
            return results;
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

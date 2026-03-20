import { setActivePinia, createPinia } from 'pinia';
import { useTicketsStore } from '@/stores/tickets.store';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock('@/router/index', () => ({
    router: { push: vi.fn() },
}));

beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
});

describe('tickets.store', () => {
    describe('initial state', () => {
        it('has empty tickets array', () => {
            const store = useTicketsStore();
            expect(store.tickets).toEqual([]);
        });

        it('has loading false and error false', () => {
            const store = useTicketsStore();
            expect(store.loading).toBe(false);
            expect(store.error).toBe(false);
        });

        it('has default pagination values', () => {
            const store = useTicketsStore();
            expect(store.currentPage).toBe(1);
            expect(store.limit).toBe(50);
            expect(store.pages).toBe(1);
            expect(store.offset).toBe(0);
            expect(store.totalTickets).toBe(0);
        });

        it('has default view set to all', () => {
            const store = useTicketsStore();
            expect(store.view).toBe('all');
            expect(store.viewText).toBe('All Tickets');
        });

        it('has default st_count with Open, On Hold, Closed', () => {
            const store = useTicketsStore();
            expect(store.st_count).toHaveLength(3);
            expect(store.st_count[0].ticketstatustitle).toBe('Open');
            expect(store.st_count[1].ticketstatustitle).toBe('On Hold');
            expect(store.st_count[2].ticketstatustitle).toBe('Closed');
        });
    });

    describe('getters', () => {
        it('hasTickets returns false when empty', () => {
            const store = useTicketsStore();
            expect(store.hasTickets).toBe(false);
        });

        it('hasTickets returns true when tickets exist', () => {
            const store = useTicketsStore();
            store.tickets = [{ ticketid: '1', checked: false } as any];
            expect(store.hasTickets).toBe(true);
        });

        it('allChecked returns false when no tickets', () => {
            const store = useTicketsStore();
            expect(store.allChecked).toBe(false);
        });

        it('allChecked returns true when all tickets are checked', () => {
            const store = useTicketsStore();
            store.tickets = [
                { ticketid: '1', checked: true } as any,
                { ticketid: '2', checked: true } as any,
            ];
            expect(store.allChecked).toBe(true);
        });

        it('allChecked returns false when some tickets are unchecked', () => {
            const store = useTicketsStore();
            store.tickets = [
                { ticketid: '1', checked: true } as any,
                { ticketid: '2', checked: false } as any,
            ];
            expect(store.allChecked).toBe(false);
        });
    });

    describe('fetchTickets()', () => {
        it('populates tickets array', async () => {
            const mockResponse = {
                ima: 'client',
                custid: 123,
                view: 'all',
                selected_period: '30',
                currentPage: 1,
                limit: 50,
                pages: 2,
                offset: 0,
                total: { tickets: 75 },
                st_count: [
                    { ticketstatustitle: 'Open', st_count: 10 },
                    { ticketstatustitle: 'On Hold', st_count: 5 },
                    { ticketstatustitle: 'Closed', st_count: 60 },
                ],
                tickets: [
                    { ticketid: '1', subject: 'Test ticket 1' },
                    { ticketid: '2', subject: 'Test ticket 2' },
                ],
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockResponse);

            const store = useTicketsStore();
            await store.fetchTickets();

            expect(store.tickets).toHaveLength(2);
            expect(store.tickets[0].ticketid).toBe('1');
            expect(store.tickets[0].checked).toBe(false);
            expect(store.totalTickets).toBe(75);
            expect(store.pages).toBe(2);
            expect(store.loading).toBe(false);
        });

        it('sets loading during fetch', async () => {
            let resolvePromise: (value: any) => void;
            const pendingPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });
            vi.mocked(fetchWrapper.get).mockReturnValue(pendingPromise as Promise<any>);

            const store = useTicketsStore();
            const fetchPromise = store.fetchTickets();

            expect(store.loading).toBe(true);

            resolvePromise!({
                ima: 'client',
                custid: 0,
                total: { tickets: 0 },
                tickets: [],
            });
            await fetchPromise;

            expect(store.loading).toBe(false);
        });

        it('sets error on failure', async () => {
            vi.mocked(fetchWrapper.get).mockRejectedValue(new Error('Network error'));

            const store = useTicketsStore();
            await store.fetchTickets();

            expect(store.error).toBe('Network error');
            expect(store.loading).toBe(false);
        });
    });

    describe('toggleAll()', () => {
        it('sets all tickets checked when true', () => {
            const store = useTicketsStore();
            store.tickets = [
                { ticketid: '1', checked: false } as any,
                { ticketid: '2', checked: false } as any,
            ];

            store.toggleAll(true);

            expect(store.tickets.every((t) => t.checked)).toBe(true);
        });

        it('sets all tickets unchecked when false', () => {
            const store = useTicketsStore();
            store.tickets = [
                { ticketid: '1', checked: true } as any,
                { ticketid: '2', checked: true } as any,
            ];

            store.toggleAll(false);

            expect(store.tickets.every((t) => !t.checked)).toBe(true);
        });
    });

    describe('clearChecks()', () => {
        it('unsets all checked', () => {
            const store = useTicketsStore();
            store.tickets = [
                { ticketid: '1', checked: true } as any,
                { ticketid: '2', checked: true } as any,
            ];

            store.clearChecks();

            expect(store.tickets.every((t) => !t.checked)).toBe(true);
        });
    });

    describe('pagination', () => {
        beforeEach(() => {
            vi.mocked(fetchWrapper.get).mockResolvedValue({
                ima: 'client',
                custid: 0,
                total: { tickets: 0 },
                tickets: [],
                pages: 3,
                currentPage: 2,
            });
        });

        it('nextPage calls fetchTickets with incremented page', async () => {
            const store = useTicketsStore();
            store.currentPage = 1;
            store.pages = 3;

            store.nextPage();

            expect(fetchWrapper.get).toHaveBeenCalled();
            const callUrl = vi.mocked(fetchWrapper.get).mock.calls[0][0] as string;
            expect(callUrl).toContain('page=2');
        });

        it('nextPage does nothing when on last page', () => {
            const store = useTicketsStore();
            store.currentPage = 3;
            store.pages = 3;

            store.nextPage();

            expect(fetchWrapper.get).not.toHaveBeenCalled();
        });

        it('prevPage calls fetchTickets with decremented page', async () => {
            const store = useTicketsStore();
            store.currentPage = 2;
            store.pages = 3;

            store.prevPage();

            expect(fetchWrapper.get).toHaveBeenCalled();
            const callUrl = vi.mocked(fetchWrapper.get).mock.calls[0][0] as string;
            expect(callUrl).toContain('page=1');
        });

        it('prevPage does nothing when on first page', () => {
            const store = useTicketsStore();
            store.currentPage = 1;

            store.prevPage();

            expect(fetchWrapper.get).not.toHaveBeenCalled();
        });
    });

    describe('searchTickets()', () => {
        it('posts search keyword and returns results', async () => {
            const mockResults = [
                { ticketid: '10', subject: 'Test search result' },
                { ticketid: '11', subject: 'Another result' },
            ];
            vi.mocked(fetchWrapper.post).mockResolvedValue(mockResults);

            const store = useTicketsStore();
            const results = await store.searchTickets('test');

            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/tickets'),
                { search: 'test' }
            );
            expect(results).toEqual(mockResults);
        });

        it('returns empty array on search failure', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            vi.mocked(fetchWrapper.post).mockRejectedValue(new Error('Search failed'));

            const store = useTicketsStore();
            const results = await store.searchTickets('failing-search');

            expect(results).toEqual([]);
            expect(consoleSpy).toHaveBeenCalled();
            const hasSearchFailedCall = consoleSpy.mock.calls.some((args) => args.some((a) => a === 'Search failed'));
            expect(hasSearchFailedCall).toBe(true);
            consoleSpy.mockRestore();
        });
    });
});

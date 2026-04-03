import { setActivePinia, createPinia } from 'pinia';
import { useInvoicesStore } from '@/stores/invoices.store';
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

describe('invoices.store', () => {
    describe('initial state', () => {
        it('has empty table_rows and rows', ({ annotate }) => {
            annotate('Invoices Store: verifies initial state has empty table_rows and rows arrays');
            const store = useInvoicesStore();
            expect(store.table_rows).toEqual([]);
            expect(store.rows).toEqual([]);
        });

        it('has loading false', ({ annotate }) => {
            annotate('Invoices Store: verifies loading flag defaults to false');
            const store = useInvoicesStore();
            expect(store.loading).toBe(false);
        });

        it('has error false', ({ annotate }) => {
            annotate('Invoices Store: verifies error flag defaults to false');
            const store = useInvoicesStore();
            expect(store.error).toBe(false);
        });

        it('has custid 0', ({ annotate }) => {
            annotate('Invoices Store: verifies custid defaults to 0');
            const store = useInvoicesStore();
            expect(store.custid).toBe(0);
        });

        it('months_arr has 12 months initially', ({ annotate }) => {
            annotate('Invoices Store: verifies months_arr contains all 12 month names from January through December');
            const store = useInvoicesStore();
            expect(store.months_arr).toHaveLength(12);
            expect(store.months_arr[0]).toBe('January');
            expect(store.months_arr[11]).toBe('December');
        });
    });

    describe('getAll()', () => {
        it('fetches invoice list and sets state', async ({ annotate }) => {
            await annotate('Invoices Store: verifies getAll() fetches invoice list and populates custid, table_rows, table_header, and resets loading');
            const mockResponse = {
                custid: 456,
                years_arr: { 2024: 2024, 2025: 2025 },
                months_arr: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                sortcol: 1,
                sortdir: 0,
                textextraction: '"complex"',
                table_header: ['ID', 'Date', 'Description', 'Amount'],
                size: 100,
                sizes: '10,25,50,100',
                table_rows: [
                    { id: 1, description: 'VPS Hosting', amount: '$10.00' },
                    { id: 2, description: 'Domain Renewal', amount: '$15.00' },
                ],
                rows: [
                    { id: 1, description: 'VPS Hosting', amount: '$10.00' },
                ],
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockResponse);

            const store = useInvoicesStore();
            await store.getAll();

            expect(store.custid).toBe(456);
            expect(store.table_rows).toHaveLength(2);
            expect(store.table_header).toEqual(['ID', 'Date', 'Description', 'Amount']);
            expect(store.loading).toBe(false);
        });

        it('sets loading during fetch', async ({ annotate }) => {
            await annotate('Invoices Store: verifies getAll() sets loading=true during API call and resets to false after completion');
            let resolvePromise: (value: any) => void;
            const pendingPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });
            vi.mocked(fetchWrapper.get).mockReturnValue(pendingPromise as Promise<any>);

            const store = useInvoicesStore();
            const fetchPromise = store.getAll();

            expect(store.loading).toBe(true);

            resolvePromise!({
                custid: 0,
                years_arr: [],
                months_arr: [],
                sortcol: 0,
                sortdir: 1,
                textextraction: '',
                table_header: [],
                size: 100,
                sizes: '',
                table_rows: [],
                rows: [],
            });
            await fetchPromise;

            expect(store.loading).toBe(false);
        });

        it('sets error on failure', async ({ annotate }) => {
            await annotate('Invoices Store: verifies getAll() sets error state and resets loading on API failure');
            vi.mocked(fetchWrapper.get).mockRejectedValue('API error');

            const store = useInvoicesStore();
            await store.getAll();

            expect(store.error).toBe('API error');
            expect(store.loading).toBe(false);
        });
    });

    describe('getInvoice()', () => {
        it('fetches a single invoice by id', async ({ annotate }) => {
            await annotate('Invoices Store: verifies getInvoice() fetches invoice HTML by ID from /billing/invoices/{id} and returns the response');
            const mockInvoice = '<html>Invoice #123</html>';
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockInvoice);

            const store = useInvoicesStore();
            const result = await store.getInvoice(123);

            expect(result).toBe(mockInvoice);
            expect(fetchWrapper.get).toHaveBeenCalledWith(
                expect.stringContaining('/billing/invoices/123')
            );
        });
    });
});

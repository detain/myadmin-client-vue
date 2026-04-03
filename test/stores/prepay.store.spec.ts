import { setActivePinia, createPinia } from 'pinia';
import { usePrePayStore } from '@/stores/prepay.store';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

vi.mock('@/router/index', () => ({
    router: { push: vi.fn() },
}));

beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
});

describe('prepay.store', () => {
    describe('initial state', () => {
        it('has default values', ({ annotate }) => {
            annotate('Prepay Store: verifies all initial state defaults (loading, error, custid, ima, modules, prepays, pagination fields)');
            const store = usePrePayStore();
            expect(store.loading).toBe(false);
            expect(store.error).toBe(false);
            expect(store.custid).toBe(0);
            expect(store.ima).toBe('client');
            expect(store.modules).toEqual({});
            expect(store.prepays).toEqual({});
            expect(store.total_pages).toBe(0);
            expect(store.total_records).toBe(0);
            expect(store.limit).toBe(10);
            expect(store.page).toBe(1);
            expect(store.curr_page_records).toBe(0);
            expect(store.allInfo).toEqual({});
        });
    });

    describe('register()', () => {
        it('calls fetchWrapper.post with user data', async ({ annotate }) => {
            await annotate('Prepay Store: verifies register() sends POST to /register endpoint with provided user data');
            vi.mocked(fetchWrapper.post).mockResolvedValue({});
            const store = usePrePayStore();
            const userData = { email: 'test@example.com' };
            await store.register(userData);
            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/register'),
                userData
            );
        });
    });

    describe('load()', () => {
        it('loads prepays without page parameter', async ({ annotate }) => {
            await annotate('Prepay Store: verifies load() without page param fetches /billing/prepays and populates custid and modules');
            const mockResponse = {
                error: false,
                custid: 1,
                ima: 'client',
                modules: { vps: 'VPS' },
                prepays: {},
                total_pages: 1,
                total_records: 0,
                limit: 10,
                page: 1,
                curr_page_records: 0,
                allInfo: {},
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockResponse);
            const store = usePrePayStore();
            await store.load();
            expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/billing/prepays'));
            expect(store.loading).toBe(false);
            expect(store.custid).toBe(1);
            expect(store.modules).toEqual({ vps: 'VPS' });
        });

        it('loads prepays with page parameter', async ({ annotate }) => {
            await annotate('Prepay Store: verifies load(2) appends ?page=2 to the API URL and stores pagination state');
            const mockResponse = {
                error: false,
                custid: 1,
                ima: 'client',
                modules: {},
                prepays: {},
                total_pages: 3,
                total_records: 25,
                limit: 10,
                page: 2,
                curr_page_records: 10,
                allInfo: {},
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockResponse);
            const store = usePrePayStore();
            await store.load(2);
            expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/billing/prepays?page=2'));
            expect(store.page).toBe(2);
            expect(store.total_pages).toBe(3);
        });

        it('handles error during load', async ({ annotate }) => {
            await annotate('Prepay Store: verifies load() resets loading to false on network error without throwing');
            vi.mocked(fetchWrapper.get).mockRejectedValue(new Error('Network error'));
            const store = usePrePayStore();
            await store.load();
            expect(store.loading).toBe(false);
        });
    });

    describe('delete()', () => {
        it('calls fetchWrapper.delete with id', async ({ annotate }) => {
            await annotate('Prepay Store: verifies delete() sends DELETE request to endpoint with the specified prepay ID');
            vi.mocked(fetchWrapper.delete).mockResolvedValue({});
            const store = usePrePayStore();
            await store.delete(123);
            expect(fetchWrapper.delete).toHaveBeenCalledWith(expect.stringContaining('/123'));
        });
    });

    describe('update()', () => {
        it('is a no-op placeholder', async ({ annotate }) => {
            await annotate('Prepay Store: verifies update() exists as a no-op placeholder that does not throw when called');
            const store = usePrePayStore();
            await store.update(1, { amount: 100 });
            // Should not throw
        });
    });
});

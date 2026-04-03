import { setActivePinia, createPinia } from 'pinia';
import { useAccountStore } from '@/stores/account.store';
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
    localStorage.clear();
});

describe('account.store', () => {
    describe('initial state', () => {
        it('has account_id 0', ({ annotate }) => {
            annotate('Account Store: verifies initial account_id defaults to 0');
            const store = useAccountStore();
            expect(store.data.account_id).toBe(0);
        });

        it('has empty accountList', ({ annotate }) => {
            annotate('Account Store: verifies accountList initializes as an empty array');
            const store = useAccountStore();
            expect(store.accountList).toEqual([]);
        });

        it('has loading false', ({ annotate }) => {
            annotate('Account Store: verifies loading flag defaults to false');
            const store = useAccountStore();
            expect(store.loading).toBe(false);
        });

        it('has error false', ({ annotate }) => {
            annotate('Account Store: verifies error flag defaults to false');
            const store = useAccountStore();
            expect(store.error).toBe(false);
        });

        it('has ima set to client', ({ annotate }) => {
            annotate('Account Store: verifies ima (identity) defaults to client role');
            const store = useAccountStore();
            expect(store.ima).toBe('client');
        });

        it('has default data fields', ({ annotate }) => {
            annotate('Account Store: verifies default data fields (account_lid empty, name empty, currency USD, payment_method paypal)');
            const store = useAccountStore();
            expect(store.data.account_lid).toBe('');
            expect(store.data.name).toBe('');
            expect(store.data.currency).toBe('USD');
            expect(store.data.payment_method).toBe('paypal');
        });
    });

    describe('load()', () => {
        it('fetches account data and sets state', async ({ annotate }) => {
            await annotate('Account Store: verifies load() fetches account data from API and populates data, custid, gravatar, and ima');
            const mockResponse = {
                countryCurrencies: { US: 'USD' },
                custid: 789,
                data: {
                    account_id: 789,
                    account_lid: 'user@example.com',
                    name: 'Test User',
                    status: 'active',
                    pin: 1234,
                    address: '123 Main St',
                    address2: '',
                    city: 'Secaucus',
                    state: 'NJ',
                    zip: '07094',
                    phone: '555-1234',
                    country: 'US',
                    payment_method: 'paypal',
                    ima: 'client',
                    company: '',
                    currency: 'USD',
                    locale: 'auto',
                },
                enableCurrencies: false,
                enableLocales: true,
                gravatar: 'https://gravatar.com/avatar/abc',
                ima: 'client',
                ip: '192.168.1.1',
                language: 'en-US',
                limits: [],
                oauthadapters: [],
                oauthconfig: { callback: 'https://my.interserver.net/oauth/callback.php', providers: {} },
                oauthproviders: {},
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockResponse);

            const store = useAccountStore();
            await store.load();

            expect(store.data.account_id).toBe(789);
            expect(store.data.account_lid).toBe('user@example.com');
            expect(store.data.name).toBe('Test User');
            expect(store.custid).toBe(789);
            expect(store.gravatar).toBe('https://gravatar.com/avatar/abc');
            expect(store.ima).toBe('client');
            expect(store.loading).toBe(false);
        });

        it('sets loading during fetch', async ({ annotate }) => {
            await annotate('Account Store: verifies load() sets loading=true during API call and resets to false after completion');
            let resolvePromise: (value: any) => void;
            const pendingPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });
            vi.mocked(fetchWrapper.get).mockReturnValue(pendingPromise as Promise<any>);

            const store = useAccountStore();
            const loadPromise = store.load();

            expect(store.loading).toBe(true);

            resolvePromise!({
                countryCurrencies: {},
                custid: 0,
                data: { account_id: 0 },
                enableCurrencies: false,
                enableLocales: true,
                gravatar: '',
                ima: 'client',
                ip: '',
                language: 'en-US',
                limits: [],
                oauthadapters: [],
                oauthconfig: { callback: '', providers: {} },
                oauthproviders: {},
            });
            await loadPromise;

            expect(store.loading).toBe(false);
        });

        it('handles errors gracefully', async ({ annotate }) => {
            await annotate('Account Store: verifies load() resets loading to false on API failure without throwing');
            vi.mocked(fetchWrapper.get).mockRejectedValue(new Error('API down'));

            const store = useAccountStore();
            await store.load();

            expect(store.loading).toBe(false);
        });
    });

    describe('loadOnce()', () => {
        it('loads if account_id is 0', async ({ annotate }) => {
            await annotate('Account Store: verifies loadOnce() triggers API fetch when account_id is still 0 (not yet loaded)');
            const mockResponse = {
                countryCurrencies: {},
                custid: 100,
                data: { account_id: 100, account_lid: 'user@test.com', name: 'User' },
                enableCurrencies: false,
                enableLocales: true,
                gravatar: '',
                ima: 'client',
                ip: '',
                language: 'en-US',
                limits: [],
                oauthadapters: [],
                oauthconfig: { callback: '', providers: {} },
                oauthproviders: {},
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockResponse);

            const store = useAccountStore();
            expect(store.data.account_id).toBe(0);

            await store.loadOnce();

            expect(fetchWrapper.get).toHaveBeenCalled();
            expect(store.data.account_id).toBe(100);
        });

        it('does not load if account_id is already set', async ({ annotate }) => {
            await annotate('Account Store: verifies loadOnce() skips API fetch when account_id is already populated');
            const store = useAccountStore();
            store.data.account_id = 999;

            await store.loadOnce();

            expect(fetchWrapper.get).not.toHaveBeenCalled();
        });
    });

    describe('register()', () => {
        it('posts registration data', async ({ annotate }) => {
            await annotate('Account Store: verifies register() sends POST to /register endpoint with user data');
            vi.mocked(fetchWrapper.post).mockResolvedValue({});

            const store = useAccountStore();
            await store.register({ email: 'new@example.com', password: 'secret' });

            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/register'),
                { email: 'new@example.com', password: 'secret' }
            );
        });
    });

    describe('update()', () => {
        it('sends put request with params', async ({ annotate }) => {
            await annotate('Account Store: verifies update() sends PUT request to /account/{id} with provided params');
            vi.mocked(fetchWrapper.put).mockResolvedValue({});

            const store = useAccountStore();
            await store.update(789, { name: 'Updated Name' });

            expect(fetchWrapper.put).toHaveBeenCalledWith(
                expect.stringContaining('/789'),
                { name: 'Updated Name' }
            );
        });
    });

    describe('update() with logged-in user', () => {
        it('updates auth store user when updating own record', async ({ annotate }) => {
            await annotate('Account Store: verifies update() syncs changes to authStore.user and localStorage when updating the logged-in user account');
            vi.mocked(fetchWrapper.put).mockResolvedValue({});

            // We need to set up auth store with matching account_id
            const { useAuthStore } = await import('@/stores/auth.store');
            const authStore = useAuthStore();
            authStore.user = { account_id: 42, name: 'Old Name', account_lid: 'user@test.com' } as any;

            const store = useAccountStore();
            await store.update(42, { name: 'New Name' });

            expect(fetchWrapper.put).toHaveBeenCalledWith(
                expect.stringContaining('/42'),
                { name: 'New Name' }
            );
            expect(authStore.user.name).toBe('New Name');
            expect(JSON.parse(localStorage.getItem('user') || '{}')).toMatchObject({ name: 'New Name' });
        });

        it('does not update auth store when updating different user', async ({ annotate }) => {
            await annotate('Account Store: verifies update() does not modify authStore.user when the updated account_id differs from logged-in user');
            vi.mocked(fetchWrapper.put).mockResolvedValue({});

            const { useAuthStore } = await import('@/stores/auth.store');
            const authStore = useAuthStore();
            authStore.user = { account_id: 42, name: 'My Name', account_lid: 'user@test.com' } as any;

            const store = useAccountStore();
            await store.update(999, { name: 'Other Name' });

            expect(authStore.user.name).toBe('My Name');
        });
    });

    describe('delete()', () => {
        it('removes account from list after deletion', async ({ annotate }) => {
            await annotate('Account Store: verifies delete() removes the specified account from accountList by filtering out the deleted ID');
            vi.mocked(fetchWrapper.delete).mockResolvedValue({});

            const store = useAccountStore();
            store.accountList = [
                { account_id: 1, account_lid: 'a@test.com' } as any,
                { account_id: 2, account_lid: 'b@test.com' } as any,
            ];

            await store.delete(1);

            expect(store.accountList).toHaveLength(1);
            expect(store.accountList[0].account_id).toBe(2);
        });
    });
});

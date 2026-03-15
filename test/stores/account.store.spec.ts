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
        it('has account_id 0', () => {
            const store = useAccountStore();
            expect(store.data.account_id).toBe(0);
        });

        it('has empty accountList', () => {
            const store = useAccountStore();
            expect(store.accountList).toEqual([]);
        });

        it('has loading false', () => {
            const store = useAccountStore();
            expect(store.loading).toBe(false);
        });

        it('has error false', () => {
            const store = useAccountStore();
            expect(store.error).toBe(false);
        });

        it('has ima set to client', () => {
            const store = useAccountStore();
            expect(store.ima).toBe('client');
        });

        it('has default data fields', () => {
            const store = useAccountStore();
            expect(store.data.account_lid).toBe('');
            expect(store.data.name).toBe('');
            expect(store.data.currency).toBe('USD');
            expect(store.data.payment_method).toBe('paypal');
        });
    });

    describe('load()', () => {
        it('fetches account data and sets state', async () => {
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

        it('sets loading during fetch', async () => {
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

        it('handles errors gracefully', async () => {
            vi.mocked(fetchWrapper.get).mockRejectedValue(new Error('API down'));

            const store = useAccountStore();
            await store.load();

            expect(store.loading).toBe(false);
        });
    });

    describe('loadOnce()', () => {
        it('loads if account_id is 0', async () => {
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

        it('does not load if account_id is already set', async () => {
            const store = useAccountStore();
            store.data.account_id = 999;

            await store.loadOnce();

            expect(fetchWrapper.get).not.toHaveBeenCalled();
        });
    });

    describe('register()', () => {
        it('posts registration data', async () => {
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
        it('sends put request with params', async () => {
            vi.mocked(fetchWrapper.put).mockResolvedValue({});

            const store = useAccountStore();
            await store.update(789, { name: 'Updated Name' });

            expect(fetchWrapper.put).toHaveBeenCalledWith(
                expect.stringContaining('/789'),
                { name: 'Updated Name' }
            );
        });
    });

    describe('delete()', () => {
        it('removes account from list after deletion', async () => {
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

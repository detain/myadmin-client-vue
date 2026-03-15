import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import { useAlertStore } from '@/stores/alert.store';
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
    localStorage.clear();
});

describe('auth.store', () => {
    describe('initial state', () => {
        it('has null sessionId and empty user', () => {
            localStorage.removeItem('sessionId');
            localStorage.removeItem('user');
            setActivePinia(createPinia());
            const store = useAuthStore();
            expect(store.sessionId).toBeNull();
            expect(store.user).toEqual({});
        });

        it('has null apiKey', () => {
            const store = useAuthStore();
            expect(store.apiKey).toBeNull();
        });

        it('has default opts', () => {
            const store = useAuthStore();
            expect(store.opts.tfa).toBe(false);
            expect(store.opts.verify).toBe(false);
            expect(store.opts.captcha).toBe(true);
        });

        it('has default counts', () => {
            const store = useAuthStore();
            expect(store.counts).toEqual({ vps: 0, websites: 0, servers: 0 });
        });
    });

    describe('loggedIn()', () => {
        it('returns false when no session or apiKey', () => {
            localStorage.removeItem('sessionId');
            setActivePinia(createPinia());
            const store = useAuthStore();
            store.sessionId = null;
            store.apiKey = null;
            expect(store.loggedIn()).toBe(false);
        });

        it('returns true when sessionId is set', () => {
            const store = useAuthStore();
            store.sessionId = 'abc123';
            expect(store.loggedIn()).toBe(true);
        });

        it('returns true when apiKey is set', () => {
            const store = useAuthStore();
            store.apiKey = 'key456';
            expect(store.loggedIn()).toBe(true);
        });
    });

    describe('login()', () => {
        it('sets user and sessionId with valid credentials', async () => {
            const mockUser = { sessionId: 'sess123', account_id: 1, name: 'Test User' };
            vi.mocked(fetchWrapper.post).mockResolvedValue(mockUser);

            const store = useAuthStore();
            await store.login({ username: 'test', password: 'pass' });

            expect(store.user).toEqual(mockUser);
            expect(store.sessionId).toBe('sess123');
            expect(localStorage.getItem('sessionId')).toBe('sess123');
            expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
        });

        it('sets error via alertStore with invalid credentials', async () => {
            const mockError = { message: 'Invalid credentials' };
            vi.mocked(fetchWrapper.post).mockRejectedValue(mockError);

            const store = useAuthStore();
            await store.login({ username: 'bad', password: 'bad' });

            const alertStore = useAlertStore();
            expect(alertStore.alert).not.toBeNull();
            expect(alertStore.alert?.type).toBe('alert-danger');
        });

        it('sets opts.tfa when error field is tfa', async () => {
            const mockError = { message: 'TFA required', field: 'tfa' };
            vi.mocked(fetchWrapper.post).mockRejectedValue(mockError);

            const store = useAuthStore();
            await store.login({ username: 'test', password: 'pass' });

            expect(store.opts.tfa).toBe(true);
        });
    });

    describe('logout()', () => {
        it('clears user and sessionId', async () => {
            vi.mocked(fetchWrapper.getNoLogout).mockResolvedValue({});

            const store = useAuthStore();
            store.user = { sessionId: 'sess123', account_id: 1, name: 'Test' };
            store.sessionId = 'sess123';
            localStorage.setItem('user', JSON.stringify(store.user));
            localStorage.setItem('sessionId', 'sess123');

            await store.logout();

            expect(store.user).toEqual({});
            expect(store.sessionId).toBeNull();
            expect(store.apiKey).toBeNull();
            expect(localStorage.getItem('user')).toBeNull();
            expect(localStorage.getItem('sessionId')).toBeNull();
        });
    });

    describe('load()', () => {
        it('fetches login page data and sets logo, captcha, counts', async () => {
            const mockResponse = {
                logo: '//example.com/logo.png',
                captcha: 'captcha-data-abc',
                language: 'en-US',
                counts: { vps: 5, websites: 3, servers: 1 },
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockResponse);

            const store = useAuthStore();
            await store.load();

            expect(store.logo).toBe('//example.com/logo.png');
            expect(store.captcha).toBe('captcha-data-abc');
            expect(store.language).toBe('en-US');
            expect(store.counts).toEqual({ vps: 5, websites: 3, servers: 1 });
        });
    });

    describe('reloadCaptcha()', () => {
        it('updates captcha', async () => {
            vi.mocked(fetchWrapper.get).mockResolvedValue({ captcha: 'new-captcha-xyz' });

            const store = useAuthStore();
            store.captcha = 'old-captcha';
            await store.reloadCaptcha();

            expect(store.captcha).toBe('new-captcha-xyz');
        });
    });

    describe('signup()', () => {
        it('sets user on success', async () => {
            const mockUser = { sessionId: 'signup-sess', account_id: 2, name: 'New User' };
            vi.mocked(fetchWrapper.post).mockResolvedValue(mockUser);

            const store = useAuthStore();
            await store.signup({ email: 'new@example.com', password: 'pass' });

            expect(store.user).toEqual(mockUser);
            expect(store.sessionId).toBe('signup-sess');
        });

        it('sets error via alertStore on failure', async () => {
            const mockError = { message: 'Signup failed' };
            vi.mocked(fetchWrapper.post).mockRejectedValue(mockError);

            const store = useAuthStore();
            await store.signup({ email: 'bad@example.com', password: 'x' });

            const alertStore = useAlertStore();
            expect(alertStore.alert).not.toBeNull();
            expect(alertStore.alert?.type).toBe('alert-danger');
        });
    });
});
